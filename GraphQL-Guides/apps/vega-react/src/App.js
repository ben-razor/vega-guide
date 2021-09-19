import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';

import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: 'https://lb.testnet.vega.xyz/query',
  cache: new InMemoryCache()
});

function App() {
 
  const initialQueryText = `{
  markets {
    name 
  }
}`;

  const [queryText, setQueryText] = useState(initialQueryText);
  const [query, setQuery] = useState(gql`${initialQueryText}`);

  const { loading, error, data } = useQuery(query);

  function runQuery(e) {
    let newQuery= query;

    try {
      newQuery = gql`${queryText}`;
    }
    catch(e) { /* Ignore invalid queries */ };

    setQuery(newQuery); 
    e.preventDefault();
  }

  return (
      <div className="App">
        <header className="App-header">
          <h3>Vega Protocol GraphQL Query</h3>
          <form onSubmit={runQuery}>
            <textarea value={queryText} rows={8} cols={40} onChange={(e) => setQueryText(e.target.value)} />
            <br />
            <input type="submit" value="Submit" />
          </form>
        </header>
        <div>{data.markets.map(market => 
          <div>{market.name}</div>
        )}</div>
      </div>
 );
}

export default App;
