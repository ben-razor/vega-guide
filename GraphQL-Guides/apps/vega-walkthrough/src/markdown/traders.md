### Trader Information 

In the [Vega Protocol](https://vega.xyz/) each party is identified by their **public key**. The keys are generated and stored by a **wallet**. Traders may have more than one public key. A **party** is an entity represented by a public key, that trades on the system.

This query gets information about the traders on the system.

You may want to see the trades that you or another party has performed. Try the following:

```
{
  parties(id: "79042cbcff5afd0d50c177870a151d59c0f87bea70614570301047d192f9cfc5") {
    trades {
      market {name}, size, price, createdAt
    }
  }
}
```
___
Check out the schema for <a href="https://docs.fairground.vega.xyz/api/graphql/party.doc.html" target="_blank">Traders</a> 