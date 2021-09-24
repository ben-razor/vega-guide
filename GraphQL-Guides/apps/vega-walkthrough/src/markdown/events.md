### Streaming Events

Vega provides a rich bus event API that you can access using GraphQL **subscriptions**.

#### Inline Fragments 

The bus event provides a number of different objects with different fields. GraphQL supports this with the concept of <a href="https://graphql.org/learn/queries/#inline-fragments" target="_blank">Inline fragments</a>

subscription {
  busEvents(types: [TimeUpdate], batchSize: 1) {
    event {
    	... on TimeUpdate {
      	timestamp
      }
    }
  }
}

#### Assets 

Let's get up and running with a simple example. The query gets tradable assets on Vega Protocol and returns their name, symbol and totalSupply. 

Click run to view the results.