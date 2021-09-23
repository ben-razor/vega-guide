### Placing Orders - Sending The Transaction

In the previous steps you obtain a **public key**, **bearer token** and a **hash / blob**.

#### Signing Transactions

Transactions are signed using the <a href="https://docs.fairground.vega.xyz/wallet-api/#sign-a-transaction" target="_blank">Vega Wallet REST API</a>.

If all the details were provided in previous steps. The transaction will have been signed in the background. The signature will be displayed in the console. If not, you may need to redo the previous steps.

#### Submit Transaction

If all has gone well, you will see a GraphQL **mutation** to submit your transaction.

Click Run Query to send the transaction to the network.
___

Check out the <a href="https://docs.fairground.vega.xyz/docs/api-howtos/wallet/" target="_blank">Vega Wallet API Documentation</a> to see how to manage wallets.

Find out more about <a href="https://docs.fairground.vega.xyz/docs/api-howtos/submit-order/" target="_blank">submitting API orders</a>.
