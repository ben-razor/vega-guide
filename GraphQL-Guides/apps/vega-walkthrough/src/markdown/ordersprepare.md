### Placing Orders - Sending The Order

In the previous step you should have obtained a **public key** and a **bearer token**. These should be displayed in the console output. If not, you may want to redo the previous step.

#### Order Data 

We have gathered some recent order information and created a JSON object based on it. If the previous step was completed, the JSON will contain your **public key**.

#### Signing

Click Run Query to send the order. A HTTP request is created with the JSON in the body and your bearer token in the Authorization header.

If all goes well you should see a **signature** in the console. The servers will use this to verify that you are authorized to make transactions fromm the **public key**.

#### Sending

The JSON field **propogate** means that after the server has signed the query, it will forward it for processing.
___

Check out the <a href="https://docs.fairground.vega.xyz/docs/api-howtos/wallet/" target="_blank" rel="noreferrer">Vega Wallet API Documentation</a> to see how to manage wallets.

Find out more about <a href="https://docs.fairground.vega.xyz/docs/api-howtos/submit-order/" target="_blank">submitting API orders</a>.
