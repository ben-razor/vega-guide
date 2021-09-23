### Trader Information 

In the <a href="https://vega.xyz/" targcet="_blank">Vega Protocol</a> each party is identified by their **public key**. The keys are generated and stored by a **wallet**. Traders may have more than one public key. A **party** is an entity represented by a public key, that trades on the system.

Click run to get the public keys of the traders on the system.

#### Query Arguments

You may want to see the trades that you or another party has performed.

**Arguments** are passed in brackets after the object name in the form **name(field: value)**.

Try the following:

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
Check out the schema for <a href="https://docs.fairground.vega.xyz/api/graphql/party.doc.html" targcet="_blank">Traders</a> 