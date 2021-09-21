### Placing Orders - Getting a Transaction Hash

In the previous step you should have obtained a **public key** and a **bearer token**. These should be displayed in the console output. If not, you may want to redo the previous step.

#### Transaction Hash

Transactions must be **signed** before sending. We first need to prepare our order. This will return a **transaction hash** that will be used in the final step of the order process.

#### Prepare Order 

We have gathered some recent trade information and created a GraphQL order based on it.

This order is preceeded by **mutation** meaning that it will make changes on the Vega System. **blob** in the query means that the **blob** field of the prepareOrderSubmit will be returned. This is the transaction hash that we will use when signing the transaction.

Click **Run Query** to get a transaction hash.
___

Check out the <a href="https://docs.fairground.vega.xyz/docs/api-howtos/wallet/" target="_blank">Vega Wallet API Documentation</a> to see how to manage wallets.

Find out more about <a href="https://docs.fairground.vega.xyz/docs/api-howtos/submit-order/" target="_blank">submitting API orders</a>.
