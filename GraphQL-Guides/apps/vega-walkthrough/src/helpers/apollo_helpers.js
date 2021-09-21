/**
 * Takes an Apollo GraphQL error object and returns a string representation of 
 * the error as returned by the server.
 * 
 * The error should be contained in error.graphQLErrors but there is a bug in Apollo
 * at the time of writing so we need to use error.networkError.result.errors instead.
 * 
 * @param {object} error Apollo GraphQL error object 
 * @returns string
 */
function getErrorMessage(error) {
  console.log(error);

  let errorMsg = 'Check the console for errors.';
  
  if(error.networkError?.result?.errors) {
    let networkErrorMsg = error.networkError.result.errors[0].message;
    if(networkErrorMsg) {
      errorMsg = networkErrorMsg;
    }
  }
  else if(error.message) {
    errorMsg = error.message
  }
  return errorMsg;
}

/**
 * processes returned values from an Apollo useQuery call.
 * 
 * Either returns a loading message, an error message, or a table containing
 * the results depending on the state of the response.
 * 
 * @param {object} data Apollo GraphQl results object
 * @param {boolean} loading 
 * @param {object} error Apollo GraphQl error object
 * @returns 
 */
function getResultsTable(data, loading, error, MAX_RECORDS=0) {
  let content;
  let records;

  if(loading) {
    content = <div>Loading data...</div>;
  }
  else if(error) {
    // The getErrorMessage helper grabs any textual error the server has sent and
    // displays it.
    content = <div>Error loading data: <br /> {getErrorMessage(error)}</div>;
  }
  else if(data) {
    // The returned data is keyed by a record type like "assets" or "markets"
    let recordType = Object.keys(data)[0];

    // If a single record is returned, convert it to array so all are treated equal
    if(Array.isArray(data[recordType])) {
      if(MAX_RECORDS) {
        records = data[recordType].slice(0, MAX_RECORDS);
      }
      else {
        records = data[recordType];
      }
    }
    else {
      records = [ data[recordType] ];
    }

    let numRows = records.length;
    
    if(numRows > 0) {
      // The tabulateRecords helper creates a table by looping through
      // the records. If a value contains an object or array, it is cleaned
      // up and stringified for display.
      content = tabulateRecords(records, MAX_RECORDS);
      if(numRows === MAX_RECORDS) {
        content = [content, <div className="max-records-message">The maximum of {MAX_RECORDS} records are displayed</div>]
      }
    }
    else {
      content = <div>The query returned no records</div>
    }
  }
  return content;
}

/**
 * Takes an array of records retrieved by Apollo, formats them into a react table.
 * 
 * @param {array} records 
 * @returns JSX table
 */
function tabulateRecords(records, maxRecords) {
  let table;
  let keys = Object.keys(records[0]).filter(x => !x.startsWith('__'));
  let header = <tr> {keys.map(key => <th>{key}</th>)} </tr>
  let rows = [];
  for(let row of records) {
    let cols = [];
    for(let key of keys) {
      let keyText = 'None';
      if(row[key] !== null) {
        keyText = typeof row[key] === 'object' ? formatObject(row[key], maxRecords) : row[key];
      }
      cols.push(<td>{keyText}</td>);
    }
    rows.push(<tr>{cols}</tr>)
  }
  table = <table className="results-table"><thead>{header}</thead><tbody>{rows}</tbody></table>

  return table;
}

/**
 * Records returned from Apollo GraphQL calls have a type field called __typename.
 * 
 * This function recursively removes this field from returned results.
 * 
 * @param {object} obj An Apollo object returned from a GraphQL call  
 * @returns object
 */
function cleanObject(obj) {
  let newObj = {};
  for(const [key, value] of Object.entries(obj)) {
    let newValue = value;

    if(key !== '__typename') {
      if(typeof value === 'object') {
        newValue = cleanObject(value);
      }
      newObj[key] = newValue;
    }
  }
  return newObj;
}

/**
 * Takes a record returned from an Apollo GraphQL call. Removes non-display fields
 * and stringifys for display.
 * 
 * @param {object} obj An Apollo object returned from a GraphQL call  
 * @returns string A clean stringified representation of the record 
 */
function formatObject(obj, maxRecords) {
  let newObj = cleanObject(obj);
  return objectToString(newObj, maxRecords).split('\n').map(str => <p>{str}</p>);
}

function objectToString(obj, maxRecords) {
  let stringified = '';
  let entryStrings = [];
  for(let [key, value] of Object.entries(obj)) {
    if(typeof value === 'string') {
      entryStrings.push(`${key}: ${value.slice(0, 64)}\n`);
    }
    else if(Array.isArray(value)) {
      for(let item in value) {
        entryStrings.push(JSON.stringify(item)); 
      }
    }
    else {
      entryStrings.push(JSON.stringify(value, undefined, 2).replaceAll(/[{},]/g, ''));
    }
  }
  if(maxRecords) {
    entryStrings = entryStrings.slice(0, maxRecords);
  }
  stringified = entryStrings.join('\n');
  return stringified;
}

export { 
  getErrorMessage, 
  getResultsTable, 
  tabulateRecords, 
  cleanObject, 
  formatObject 
};