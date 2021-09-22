### Placing Orders - Sending The Transaction

In the previous steps you obtain a **public key**, **bearer token** and a **Transaction Hash**. These should be displayed in the console output. If not, you may need to redo the previous steps.

#### Signing Transactions

Transactions can be signed using the <a href="https://docs.fairground.vega.xyz/wallet-api/#sign-a-transaction" target="_blank">Vega REST API</a>.

If all the details we're provided from previous steps. The transaction will have been signed in the background by the REST API. The signature will then be displayed in the console.

We also passed the **propogate** field to the signing. This means that the server will have have also forwarded the order for processing.

#### Retrieving Orders

If all has gone well, you will see a GraphQL query for orders on your **public** key.

Click Run Query to get the order details.
___

Check out the <a href="https://docs.fairground.vega.xyz/docs/api-howtos/wallet/" target="_blank">Vega Wallet API Documentation</a> to see how to manage wallets.

Find out more about <a href="https://docs.fairground.vega.xyz/docs/api-howtos/submit-order/" target="_blank">submitting API orders</a>.
