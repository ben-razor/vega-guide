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

We enter [App.js](https://github.com/ben-razor/vega-guide/blob/main/GraphQL-Guides/apps/vega-react/src/App.js) and delete the content of the App element.

To interact with GraphQL we need a library. For this applicaton we use [Apollo Client](https://www.apollographql.com/docs/react/get-started/):

```
yarn add @apollo/client graphql
```

Add the library import to [App.js](https://github.com/ben-razor/vega-guide/blob/main/GraphQL-Guides/apps/vega-react/src/App.js).

```JavaScript
import { 
    ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql 
} from "@apollo/client";
```

## Vega Configuration

We will be interacting with the Vega Testnet so we initialize the client with the Vega URI. We add this to [App.js](https://github.com/ben-razor/vega-guide/blob/main/GraphQL-Guides/apps/vega-react/src/App.js):

```JavaScript
    const client = new ApolloClient({
        uri: 'https://lb.testnet.vega.xyz/query',
        cache: new InMemoryCache()
    });
```

## Extending The Application

We now have the tools in place to interact with all the advanced features that Vega GraphQL API has to offer.

The following resources are available to explore the API further: 

[Vega GraphQL schema](https://docs.fairground.vega.xyz/api/graphql/market.doc.html)

[Vega GraphQL playground](https://lb.testnet.vega.xyz/playground)