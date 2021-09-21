### Placing Orders 

We have run some **queries** to view markets, orders and traders. GraphQL also provides **mutations** to create and update records. Let's use this to create our own orders.

#### Authentication

Everyone is free to make reads on Vega. Writes are different. The transaction must be **signed** before the **mutation** is sent.

#### Wallets

Vega provides a REST API to create keys and sign transactions. To sign we need a **public key** and a **bearer token**.

Enter a name and password to create a testnet wallet.
___

Check out the <a href="https://docs.fairground.vega.xyz/docs/api-howtos/wallet/" target="_blank">Vega Wallet API Documentation</a> to see how to manage wallets.

Find out more about <a href="https://docs.fairground.vega.xyz/docs/api-howtos/submit-order/" target="_blank">submitting API orders</a>.


