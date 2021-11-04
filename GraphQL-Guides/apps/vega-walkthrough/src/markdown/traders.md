### Trader Information 

In the <a href="https://vega.xyz/" target="_blank" rel="noreferrer">Vega Protocol</a> each party is identified by their **public key**. The keys are generated and stored by a **wallet**. Traders may have more than one public key. A **party** is an entity represented by a public key, that trades on the system.

Click run to get the public keys of the traders on the system.

#### Query Arguments

You may want to see the trades that you or another party has performed.

**Arguments** are passed in brackets after the object name in the form **name(field: value)**.

Try the following:

```
{
  parties(id: "c211bfe8f04de3c165105100544adeed9cdad6789b743d4e7b09d899bc466cac") {
    trades {
      market {name}, size, price, createdAt
    }
  }
}
```
___
Check out the schema for <a href="https://docs.fairground.vega.xyz/api/graphql/party.doc.html" target="_blank" rel="noreferrer">Traders</a> 