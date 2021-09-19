import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from "@apollo/client";
import vega_logo from './img/vega_logo.svg';

const initialQueryText = `{
  markets {
    name 
  }
}`;

const makerFeeQueryText = `{
  markets {
    name, fees {
      factors {
        makerFee
      }
    }
  }
}`;

const assetQueryText = `{
  assets {
    name, symbol, totalSupply
  }
}`;

const templateQueries = {
  'market-name': initialQueryText,
  'market-maker-fee': makerFeeQueryText,
  'assets': assetQueryText
}

function App() {
  const [templateQuery, setTemplateQuery] = useState(gql`${initialQueryText}`);
  const [queryText, setQueryText] = useState(initialQueryText);
  const [query, setQuery] = useState(gql`${initialQueryText}`);

  const { loading, error, data } = useQuery(query);

  function handleQuerySubmit(event) {
    runQuery();
    event.preventDefault();
  }

  function runQuery() {
    let newQuery = query;

    try {
      newQuery = gql`${queryText}`;
    }
    catch(e) { /* Ignore invalid queries */ };

    setQuery(newQuery); 
  }

  console.log(loading, error, data);

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
    if(error.networkError.result.errors) {
      let networkErrorMsg = error.networkError.result.errors[0].message;
      if(networkErrorMsg) {
        errorMsg = networkErrorMsg;
      }
    }
    return errorMsg;
  }

  function getResultsTable(data, loading, error) {
    let content;

    if(loading) {
      content = <div>Loading data...</div>;
    }
    else if(error) {
      content = <div>Error loading data: <br /> {getErrorMessage(error)}</div>;
      console.log(error.networkError.result.errors);
    }
    else if(data) {
      let recordType = Object.keys(data)[0];
      let records = data[recordType];
      let numRows = records.length;
      
      if(numRows > 0) {
        content = tabulateRecords(records);
      }
      else {
        content = <div>The query returned no records</div>
      }
    }
    return content;
  }

  function tabulateRecords(records) {
    let table;
    let keys = Object.keys(records[0]).filter(x => !x.startsWith('__'));
    let header = <tr> {keys.map(key => <th>{key}</th>)} </tr>
    let rows = [];
    for(let row of records) {
      let cols = [];
      for(let key of keys) {
        let keyText = typeof row[key] === 'object' ? formatObject(row[key]) : row[key];
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
    return JSON.stringify(newObj);
  }

  function onTemplateQueryChanged(value) {
    setTemplateQuery(value);
    setQueryText(templateQueries[value]);
  }

  return (
      <div className="App">
        <a href="https://vega.xyz/">
          <img alt="Vega Protocol Logo" className="logo-vega" src={vega_logo} />
        </a>

        <form onSubmit={handleQuerySubmit}>
          <div className="query-form-container">
            <div className="query-form-text-panel">
              <textarea className="query-text-entry" value={queryText} rows={10} cols={40} onChange={(e) => setQueryText(e.target.value)} />
            </div>
            <div className="query-form-details-panel">
              <h3 className="query-form-heading">Vega Markets GraphQL</h3>
              <select className="query-form-select" onChange={e => onTemplateQueryChanged(e.target.value)} value={templateQuery}>
                <option value="" selected>Select a template query...</option>
                <option value="market-name">Markets</option>
                <option value="market-maker-fee">Maker Fees</option>
                <option value="assets">Assets</option>
              </select>
              <input className="query-text-submit" type="submit" value="Run Query" />
            </div>
          </div>
        </form>

        <div className="results-content">
          {getResultsTable(data, loading, error)}
        </div>

      </div>
 );
}

export default App;
