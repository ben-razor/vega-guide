# Vega GraphQL Walkthrough Application

A ReactJS interactive walkthrough of the GraphQL API for the [Vega Protocol](https://vega.xyz/) decentralized derivatives trading platform.

Essential Vega features to implement:

- Listing markets and market data (including market status)
- Streaming of orders and trades
- Party (trader) information for a given public key, including account balances and positions.
- Prepare and place an order on a market
- Streaming of events
- Governance proposals

View the docs at: [Vega Walkthrough Documentation](https://vega-step-by-step.web.app/docs/vega/vega-react-walkthrough/)

## Initialization

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Apollo GraphQL Client

GraphQL queries are made using the [Apollo Client](https://www.apollographql.com/docs/react/get-started/).

The [Apollo Query Guide](https://www.apollographql.com/docs/react/data/queries/) was followed to create the query code.

## Inspiration

We use the [Svelte Tutorial](https://svelte.dev/tutorial/basics) and [Svelete Examples](https://svelte.dev/examples#hello-world) as inspiration for simple hands-on getting-started documentation.

## CodeMirror

The Svelte Tutorial and the [Vega GraphQL Playground](https://lb.testnet.vega.xyz/playground) use [CodeMirror](https://codemirror.net/) editor so we will use it in this application.

We will need the [GraphQL mode](https://www.npmjs.com/package/codemirror-graphql).

## How This Code Was Bootstrapped

#### Create React App
```
npx create-react-app vega-walkthrouh
cd vega-walkthrouh
yarn start
```

#### Apollo GraphQL Library
```
yarn add @apollo/client graphql
```

#### CodeMirror Code Editor
```
yarn add codemirror
yarn add react-codemirror2
yarn add codemirror-graphql
```

