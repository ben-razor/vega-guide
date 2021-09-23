### Markets 

Markets list the products available to trade with our asssets.

Click run to list the names of some markets.

#### Sub Queries

Each market has a field called **data** that contains information about the current state of the market.

This is an object containing multiple fields so we use a sub query to pick out the information we need.

Run the following query to get recent prices for the markets:

```graphql
{
  markets {
    name, state, data {
    	bestBidPrice, bestOfferPrice
    }
  }
}
```
___
Check out the schema for <a href="https://docs.fairground.vega.xyz/api/graphql/market.doc.html" target="_blank">Markets</a> 