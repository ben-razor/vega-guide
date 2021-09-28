### Placing Orders - Summary

If all went well in the previous sections you will have created an order and sent it to the Vega Network to be processed.

There were quite a few things happening so let's do a quick review.

1. A **wallet** was created using the Vega Wallet REST API <a href="https://docs.fairground.vega.xyz/wallet-api/#sign-a-transaction" target="_blank">wallets command</a>.
2. Transaction is signed using the Vega Wallet REST API <a href="https://docs.fairground.vega.xyz/docs/api-howtos/submit-order/#4-compose-a-submit-order-message" target="_blank">sync command</a>.
3. The **propogate** field triggers the automatic sending of the transaction to the network.

#### Transaction Processing

The nodes on the Vega network check the validity of the transaction. If accepted, it will appear in the **orders** field of the **party** GraphQL object for your public key.

**The transaction that we sent will not be accepted as the account we created has no funds.**

Click **next** to head to the **next level**.
___
To create orders for real you use a funded testnet wallet.

Check out the <a href="https://docs.fairground.vega.xyz/docs/wallet/" target="_blank">Vega Wallet Options</a> and then head to the <a href="https://fairground.wtf/" target="_blank">Vega Fairground</a> to make real trades on the Vega Testnet.