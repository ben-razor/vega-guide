---
weight: 1
bookFlatSection: true
title: "ReactJS Starter"
---

# ReactJS Starter Application

## Introduction 

This guide will take you through the creation of a basic application in ReactJS that interacts with the Vega Protocol using GraphQL.

The source for the application can be found at [vega-react](https://github.com/ben-razor/vega-guide/tree/main/GraphQL-Guides/apps/vega-react).

This guide is for those looking for a starting point to build ReactJS applications that use the Vega GraphQL API.

If you are looking for a platform agnostic step-by-step guide to using the Vega GraphQL API you can jump to the [Vega GraphQL Walkthrough]({{< relref "/docs/vega/vega-react-walkthrough.md" >}}) application.

## Prerequisites

A basic knowledge of [ReactJS](https://reactjs.org/).

You know that [GraphQL](https://graphql.org/) is a concise language for making queries that offers fine-grained control over the results.

You have a shell.

## Getting Started

The application is created using create-react-app. Using your shell:

```
npx create-react-app vega-react
cd vega-react
yarn start
```

To interact with GraphQL we need a library. For this applicaton we use [Apollo Client](https://www.apollographql.com/docs/react/get-started/):

```
yarn add @apollo/client graphql
```

## Connect the Client to Vega GraphQL API Endpoint

We enter [index.js](https://github.com/ben-razor/vega-guide/blob/main/GraphQL-Guides/apps/vega-react/src/index.js) and add the library import:

```JavaScript
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
```

We will be interacting with the Vega Testnet so we initialize the client with the Vega API Endpoint on the next line:

```js
    const client = new ApolloClient({
        uri: 'https://lb.testnet.vega.xyz/query',
        cache: new InMemoryCache()
    });
```

The final step in [index.js](https://github.com/ben-razor/vega-guide/blob/main/GraphQL-Guides/apps/vega-react/src/index.js) is to add the Apollo Provider:

```jsx
    <ApolloProvider client={client}> 
      <App />
    </ApolloProvider>
```

## Using the GraphQL Client

We now turn our attention to [App.js](https://github.com/ben-razor/vega-guide/blob/main/GraphQL-Guides/apps/vega-react/src/App.js). Import **useQuery** and **gql** from the Apollo GraphQL Client:

```js
import { useQuery, gql } from "@apollo/client";
```

gql
: Converts JS template strings into Apollo GraphQL query objects

useQuery
: Takes a gql query object and performs the query on the client

## Importing the Template GraphQL Queries

We have prepared some sample queries that can be loaded and then edited by the user. The queries are placed from a separate file to keep things simple. This is also imported to [App.js](https://github.com/ben-razor/vega-guide/blob/main/GraphQL-Guides/apps/vega-react/src/App.js):

```js
import templateQueries from './template_queries';
```

## Connecting Everything Together

Now we have everything set up we are ready to perform queries against the Vega API and display the results to the user.

In [App.js](https://github.com/ben-razor/vega-guide/blob/main/GraphQL-Guides/apps/vega-react/src/App.js) we create a form with a textarea, a template query sector and a submit form (*layout divs not shown*):

```jsx
<form onSubmit={handleQuerySubmit}>
    <textarea className="query-text-entry" 
                value={queryText} rows={10} cols={40} 
                onChange={(e) => setQueryText(e.target.value)}>
    </textarea>

    <select className="query-form-select" 
            onChange={e => onTemplateIDChanged(e.target.value)} 
            value={templateID}>
        <option value="" selected>Select a template query...</option>
        <option value="markets-name">Markets</option>
        <option value="markets-details">Market Orders</option>
        <option value="assets">Assets</option>
        <option value="statistics">Statistics</option>
    </select>
    
    <input className="query-text-submit" type="submit" value="Run Query" /> 
</form>
```

When the form is submitted:

1. The query text from the textarea is picked up
2. **gql** converts the text to an Apollo GraphQL query
3. **setQuery** sets the **query** state variable to this **gql** object
4. This triggers **useQuery** to be called to run the query on the Vega GraphQL API
5. **loading**, **error** and **data** are populated with the result of the query

The following code from [App.js](https://github.com/ben-razor/vega-guide/blob/main/GraphQL-Guides/apps/vega-react/src/App.js) carries out those actions:

```js
  function handleQuerySubmit(event) {
    let newQuery = queryTextToGraphQL(query);
    setQuery(newQuery); 
    event.preventDefault();
  }

  function queryTextToGraphQL(query) {
    let newQuery = query;

    try { newQuery = gql`${queryText}`; }
    catch(e) { /* Ignore invalid queries at this point */ };

    return newQuery;
  }

  const { loading, error, data } = useQuery(query, { errorPolicy: 'all' })
```

**{ errorPolicy: 'all' }**: If there is an error on the server but some results were ok then we will be given the successful results, in addition to the error details.

## Displaying The Results

The result of calling useQuery is a **loading** boolean, a **data** object containing a single record object or an array of record objects, and an **error** object if anything went wrong. 

The following code in [App.js](https://github.com/ben-razor/vega-guide/blob/main/GraphQL-Guides/apps/vega-react/src/App.js) displays the result of the query to the user.

```jsx
  function getResultsTable(data, loading, error) {
    let content;
    let records;

    if(loading) {
      content = <div>Loading data...</div>;
    }
    else if(data) {
      // The data is keyed by a record type like "assets" or "markets"
      let recordType = Object.keys(data)[0];

      // If a single record is returned, convert it to array so all are
      // treated equal.
      if(Array.isArray(data[recordType])) {
        records = data[recordType].slice(0, MAX_RECORDS);
      }
      else {
        records = [ data[recordType] ];
      }

      let numRows = records.length;
      
      if(numRows > 0) {
        // The tabulateRecords helper creates a table by looping through the
        // records. If a value contains an object / array, it is cleaned up
        // and stringified for display in the table.
        content = tabulateRecords(records);
        if(numRows === MAX_RECORDS) {
          content = [content, <div className="max-records-message">
            The maximum of {MAX_RECORDS} records are displayed</div>
          ]
        }
      }
      else {
        content = <div>The query returned no records</div>
      }
    }
    else if(error) {
      // The getErrorMessage helper grabs any textual error the server has
      // sent and displays it.
      content = <div>Error loading data: <br /> {getErrorMessage(error)}</div>;
    }
    return content;
  }
```
## Wrapping Up

We now have a simple ReactJS application that can make queries against the Vega Protocol
GraphQL API.

The following resources are available to explore the API further: 

[Vega GraphQL schema](https://docs.fairground.vega.xyz/api/graphql/market.doc.html)

[Vega GraphQL playground](https://lb.testnet.vega.xyz/playground)

This simple application does not provide two key features of the GraphQL system.

1. Performing [mutations](https://www.apollographql.com/docs/react/data/mutations/) (writes) (These must be signed using a Vega wallet)
2. Using [subscriptions](https://www.apollographql.com/docs/react/data/subscriptions/) to get near real time updates to queries.

These are implemented and explored in the next section of this step-by-step guide: 

The [Vega GraphQL Walkthrough]({{< relref "/docs/vega/vega-react-walkthrough.md" >}}) application.