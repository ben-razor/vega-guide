### Streaming Events

Vega provides a rich bus event API that you can access using GraphQL **subscriptions**.

> An event is an action or a side-effect that is triggered by a Vega node in response to a state change, for instance, starting of an auction or blockchain time updating.

#### Inline Fragments 

The bus provides a number of different <a href="https://docs.fairground.vega.xyz/docs/api-howtos/event-stream/" target="_blank">Event Types</a> with different fields. GraphQL handles this with the concept of <a href="https://graphql.org/learn/queries/#inline-fragments" target="_blank">Inline fragments</a>. You specify the type of event using **... on EventType**. Click run to view server timestamps.


Change the type from **TimeUpdate** to **Deposit**. Change the requested fields from **timestamp** to:

```
amount, createdTimestamp, party { id }, asset { symbol }
```

Click Run Query to view the results.

___
Check out the available <a href="https://docs.fairground.vega.xyz/docs/api-howtos/event-stream/" target="_blank">Event Streams</a>. Then you can access the fields 