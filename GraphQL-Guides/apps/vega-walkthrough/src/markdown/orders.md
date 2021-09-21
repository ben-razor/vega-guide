### Placing Orders 

We have run some queries for examining markets, orders and traders. GraphQL provides **mutations** to create and update records. Let's use this to create our own orders.

#### Authentication

Everyone is free to make GraphQL reads on Vega. Writes are different. The transaction must be **signed** before the **mutation** is sent.

Behind the scenes this example uses a test key to sign transactions. To make transactions in your own application you will need a <a href="https://docs.fairground.vega.xyz/docs/wallet/" target="_blank">wallet</a>. 
___

Check out the schema for
<a href="https://docs.fairground.vega.xyz/api/graphql/mutation.doc.html" target="_blank">Mutations</a>.

Check out the <a href="https://docs.fairground.vega.xyz/docs/api-howtos/wallet/" target="_blank">Vega Wallet API Documentation</a> to see how to manage wallets.

Find out more about <a href="https://docs.fairground.vega.xyz/docs/api-howtos/submit-order/" target="_blank">submitting API orders</a>.


