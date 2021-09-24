### Placing Orders - Getting a Transaction Hash

In the previous step you should have obtained a **public key** and a **bearer token**. These should be displayed in the console output. If not, you may want to redo the previous step.

#### Transaction Hash

Transactions must be **signed** before sending. We first need to prepare the order for signing.

#### Prepare Order 

We have gathered some recent order information and created a GraphQL **mutation** based on it.

We return a field called **blob**. This is the data that we supply when signing the transaction.

Click **Run Query** to get a **blob**.
___

Check out the <a href="https://docs.fairground.vega.xyz/docs/api-howtos/wallet/" target="_blank" rel="noreferrer">Vega Wallet API Documentation</a> to see how to manage wallets.

Find out more about <a href="https://docs.fairground.vega.xyz/docs/api-howtos/submit-order/" target="_blank">submitting API orders</a>.
