import { useState } from 'react';
import SideBar from './components/SideBar';
import AppInfo from './components/AppInfo';
import './App.css';
import { useQuery, gql } from "@apollo/client";
import vega_logo from './img/vega_logo.svg';
import templateQueries from './template_queries';

const initialQueryID = 'markets-name';
const initialTemplate = templateQueries[initialQueryID];
const MAX_RECORDS = 20;

const schemaLinks = {
  'markets': 'https://docs.fairground.vega.xyz/api/graphql/market.doc.html',
  'assets': 'https://docs.fairground.vega.xyz/api/graphql/asset.doc.html',
  'statistics': 'https://docs.fairground.vega.xyz/api/graphql/statistics.doc.html'
}

function getTemplateType(templateID) {
  return templateID.split('-')[0];
}

function App() {
  const [templateID, setTemplateID] = useState('markets-name');
  const [queryText, setQueryText] = useState(initialTemplate);
  const [query, setQuery] = useState(gql`${initialTemplate}`);
  const { loading, error, data } = useQuery(query, { errorPolicy: 'all' });
  console.log(loading, error, data);

  /**
   * When the Run Query button is clicked, setQuery is called with the new query 
   * which sets in motion the Apollo Graph QL request process.
   * 
   * @param {object} event 
   */
  function handleQuerySubmit(event) {
    let newQuery = queryTextToGraphQL(query);
    setQuery(newQuery); 
    event.preventDefault();
  }

  /**
   * Takes a textual GraphQL query and returns an Apollo Query object.
   * 
   * If the query is invalid, the previous query is maintained.
   *  
   * @param {string} query 
   * @returns An Apollo GraphQL query object
   */
  function queryTextToGraphQL(query) {
    let newQuery = query;

    try {
      newQuery = gql`${queryText}`;
    }
    catch(e) { /* Ignore invalid queries */ };

    return newQuery;
  }

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
  function getResultsTable(data, loading, error) {
    let content;
    let records;

    if(loading) {
      content = <div>Loading data...</div>;
    }
    else if(data) {
      // The returned data is keyed by a record type like "assets" or "markets"
      let recordType = Object.keys(data)[0];

      // If a single record is returned, convert it to array so all are treated equal
      if(Array.isArray(data[recordType])) {
        records = data[recordType].slice(0, MAX_RECORDS);
      }
      else {
        records = [ data[recordType] ];
      }

      let numRows = records.length;
      
      if(numRows > 0) {
        // The tabulateRecords helper creates a table by looping through
        // the records. If a value contains an object or array, it is cleaned
        // up and stringified for display.
        content = tabulateRecords(records);
        if(numRows === MAX_RECORDS) {
          content = [content, <div className="max-records-message">The maximum of {MAX_RECORDS} records are displayed</div>]
        }
      }
      else {
        content = <div>The query returned no records</div>
      }
    }
    else if(error) {
      // The getErrorMessage helper grabs any textual error the server has sent and
      // displays it.
      content = <div>Error loading data: <br /> {getErrorMessage(error)}</div>;
    }
    return content;
  }

  /**
   * Takes an array of records retrieved by Apollo, formats them into a react table.
   * 
   * @param {array} records 
   * @returns JSX table
   */
  function tabulateRecords(records) {
    let table;
    let keys = Object.keys(records[0]).filter(x => !x.startsWith('__'));
    let header = <tr> {keys.map(key => <th>{key}</th>)} </tr>
    let rows = [];
    for(let row of records) {
      let cols = [];
      for(let key of keys) {
        let keyText = 'None';
        if(row[key] !== null) {
          keyText = typeof row[key] === 'object' ? formatObject(row[key]) : row[key];
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
  function formatObject(obj) {
    let newObj = cleanObject(obj);
    return JSON.stringify(newObj).slice(0, 100);
  }

  /**
   * Handle the select box changing to a new query template id.
   * 
   * @param {string} value 
   */
  function onTemplateIDChanged(value) {
    setTemplateID(value);
    setQueryText(templateQueries[value]);
  }

  return (
    <div className="App">
      <SideBar />
      <AppInfo />

      <div class="container">
        <form onSubmit={handleQuerySubmit}>
          <div className="query-form-container">

            <div className="query-form-text-panel">
              <textarea className="query-text-entry" value={queryText} rows={10}
                        onChange={(e) => setQueryText(e.target.value)}>
              </textarea>
            </div>

            <div className="query-form-details-panel">
              <h3 className="query-form-heading">Vega GraphQL Explorer</h3>

              <select className="query-form-select" onChange={e => onTemplateIDChanged(e.target.value)} value={templateID}>
                <option value="" selected>Select a template...</option>
                <option value="markets-name">Markets</option>
                <option value="markets-details">Market Orders</option>
                <option value="assets">Assets</option>
                <option value="statistics">Statistics</option>
              </select>

              <input className="query-text-submit" type="submit" value="Run Query" />

              <p>
                <img alt="Vega Protocol Logo" className="logo-vega-small" src={vega_logo} />
                View the schema for <a target="_blank" rel="noreferrer" href={schemaLinks[getTemplateType(templateID)]}>{getTemplateType(templateID)}</a>
              </p>

            </div>
          </div>

        </form>

        <div className="results-content">
          {getResultsTable(data, loading, error)}
        </div>
      </div>
    </div>
 );
}

export default App;
