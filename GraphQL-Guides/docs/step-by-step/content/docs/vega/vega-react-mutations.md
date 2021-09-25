---
weight: 30 
bookFlatSection: true
title: "ReactJS GraphQL Mutations"
---

# ReactJS GraphQL Mutations

## Introduction 


In the [Vega GraphQL React Starter]({{< relref "/docs/vega/vega-react.md" >}}) tutorial we created a simple application to query information using the Vega Protocol GraphQL API.

The application does not support GraphQL **mutations** to create and update records. In this short guide we explain how mutations were implemented in the [Vega GraphQL Walkthrough]({{< relref "/docs/vega/vega-walkthrough.md" >}}) application.

These instructions use ReactJS and [Apollo GraphQL Client](https://www.apollographql.com/docs/react/) to interact with the Vega GraphQL API.

## About Mutations 

Everyone is free to make reads on Vega. Writes are different. The GraphQL client must make authenticated requests.

To do this, a **wallet** is needed. After the wallet has been created a **Bearer Token** can be generated to use in the authorization header.

Vega wallets are managed using a [Wallet REST API](https://docs.fairground.vega.xyz/wallet-api/). The GraphQL mutation we cover is prepareOrderSubmit. A full list of available mutations is in the [GraphQL Schema](https://docs.fairground.vega.xyz/api/graphql/mutation.doc.html).

The process goes as follows:

1. REST Wallet API: A wallet is created. This returns a **bearer token**.
2. An Apollo Graph QL Client with an **authLink** is created.
3. GraphQL: A **prepareOrderSubmit** mutation creates a **blob** of the order.

## Creating A Wallet

Steps 1 and 2 take place in the [VegaWallet.js](https://github.com/ben-razor/vega-guide/blob/main/GraphQL-Guides/apps/vega-walkthrough/src/components/VegaWallet.js) source file.

First we run a query to create a wallet passing the wallet name and pass phrase:

```JavaScript
let url = 'https://wallet.testnet.vega.xyz/api/v1/wallets';
let options = {
  method: 'POST',
  headers : { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    "wallet": walletDetails.walletName,
    "passphrase": walletDetails.passPhrase
  })
} 

fetch(url, options).then(response => {
  return response.json();
})
```

## GraphQL Mutations

In order to carry out authenticated mutations with the **bearer token** we have, we need to create an Apollo Client [authLink](https://www.apollographql.com/docs/react/networking/authentication/#header).

This is carried out in [GraphQLAuthQuery.js](https://github.com/ben-razor/vega-guide/blob/main/GraphQL-Guides/apps/vega-walkthrough/src/components/GraphQLAuthQuery.js).

```js
const httpLink = createHttpLink({
  uri: 'https://lb.testnet.vega.xyz/query'
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  typeDefs: gql`
    enum Side {
      Buy,
      Sell 
    }

    enum OrderTimeInForce {
      FOK, IOC, GTC, GTT, GFA, GFN 
    }

    enum OrderType {
      Market, Limit, Network
    }

    enum SubmitTransactionType {
      Async, Sync, Commit
    }
  `
});
```

**As shown in this code, if the GraphQL query uses enum fields, these must be configured on the Apollo Client before sending the query.**

## Using the Authenticated GraphQL Client

[GraphQLAuthQuery.js](https://github.com/ben-razor/vega-guide/blob/main/GraphQL-Guides/apps/vega-walkthrough/src/components/GraphQLAuthQuery.js) forwards the client to [GraphQLOrderPrepare.js](https://github.com/ben-razor/vega-guide/blob/main/GraphQL-Guides/apps/vega-walkthrough/src/components/GraphQLOrderPrepare.js).

As the client has already been configured for authenticated connections. The rest is a standard [GraphQL mutation]() using the Apollo useMutation hook.

```
  let staticQuery = gql`
    mutation {
      prepareOrderSubmit(
        marketId: "2201cba5132fcb6e3aa589484eea006a1846826e48978e0b4182b61d0eb0a2a2",
        price: "13274709",
        size: "83",
        side: Sell,
        timeInForce: GTT,
        expiration: "2021-09-25T09:07:28.01454091Z",
        type: Limit,
        reference: "23iw0i075y1qv1bz6gqinn",
      ) {
        blob
      }
    }
  `;
  const [prepareOrder, { loading, error, data }] = useMutation(staticQuery, 
                                                   { client: client, errorPolicy: 'all' });
```

## Wrapping Up

In this short guide we covered how to perform GraphQL mutations using React and the Apollo GraphQL client.

Source code is available in the [Vega Walkthrough Github Repository](https://github.com/ben-razor/vega-guide/tree/main/GraphQL-Guides/apps/vega-walkthrough).