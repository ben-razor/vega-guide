### Subscriptions

Traders need up to date information to make profitable decisions. GraphQL provides **subscriptions** to request live feeds of results.

#### Streaming Orders

The query is a little different. To get live updates, the GraphQL begins with **subscription**.

Click run to get the ID of markets that are currently being traded.

Getting the ID for the trade isn't too useful. Try adding the market name, and the size of the trade instead:

```graphql
subscription {
  orders {
    createdAt, market { name }, size
  }
}
```
___
Check out the schema for <a href="https://docs.fairground.vega.xyz/api/graphql/order.doc.html" target="_blank">Orders</a>  

View the available <a href="https://docs.fairground.vega.xyz/docs/api-howtos/event-stream/" target="_blank">Streams</a>