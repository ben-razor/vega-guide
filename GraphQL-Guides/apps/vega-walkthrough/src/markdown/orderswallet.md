### Placing Orders 

We have run some **queries** to view markets, orders and traders. In the next few steps we will explore how to submit orders that make **updates** to the system.

To do this we take a detour away from the Vega GraphQL API to use the Vega REST API.

#### Authentication

Everyone is free to make reads on Vega. Writes are different. The transaction must be **signed** before it is sent to the network.

#### Wallets

Vega uses the REST API to create keys and send signed transactions. To sign we need a **public key** and a **bearer token**.

Enter a name and pass phrase to create a testnet wallet.
___

Check out the <a href="https://docs.fairground.vega.xyz/docs/api-howtos/wallet/" target="_blank">Vega Wallet API Documentation</a> to see how to manage wallets.

Find out more about <a href="https://docs.fairground.vega.xyz/docs/api-howtos/submit-order/" target="_blank">submitting API orders</a>.


