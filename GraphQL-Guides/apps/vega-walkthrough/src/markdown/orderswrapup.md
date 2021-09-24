### Placing Orders - Summary

If all went well in the previous sections you will have created an order using GraphQL and sent it to the Vega Network to be processed.

There were quite a few things happening so let's do a quick review.

1. A **wallet** was created using the <a href="https://docs.fairground.vega.xyz/wallet-api/#sign-a-transaction" target="_blank">Vega Wallet REST API</a>.
2. A prepareOrderSubmit GraphQL **mutation** creates a **blob** to sign.
3. Transaction is signed using the <a href="https://docs.fairground.vega.xyz/wallet-api/#sign-a-transaction" target="_blank">Vega Wallet REST API</a>.
4. A submitTransaction GraphQL **mutation** sends the order to the network.

#### Transaction Processing

The nodes on the Vega network check the validity of the transaction. If accepted, it will appear in the **orders** field of the **party** GraphQL object for your public key.

**The transaction that we sent will not be accepted as the account we created has no funds.**

Click **next** to head to the next level.
___
To create orders for real you use a funded testnet wallet. Check out the <a href="https://fairground.wtf/" target="_blank">Vega Fairground</a> to make real trades on the Vega Testnet.