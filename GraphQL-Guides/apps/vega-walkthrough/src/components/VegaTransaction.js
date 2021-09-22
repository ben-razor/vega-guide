import { useEffect, useState } from "react";
import { gql, ApolloClient, useQuery } from '@apollo/client';
function createRandomHash() {
  let hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return hash;
}

function VegaTransaction(props) {
  const transactionDetails = props.transactionDetails;
  const setTransactionDetails = props.setTransactionDetails;
  const setCustomData = props.setCustomData;
  const setValue = props.setValue;

  const [orderParams, setOrderParams] = useState();

  const recentOrderQuery = `{
    markets {
      id, orders(first: 0, last: 1) {
        price, size, expiresAt, side, timeInForce, type, reference
      }
    }
  }`;


  const { loading, error, data } = useQuery(gql`${recentOrderQuery}`, { errorPolicy: 'all' });

  useEffect(() => {
    if(!loading && !error) {
      let newOrderParams;
      let rows = data.markets;
      let recentTrade = rows[0];
      if(recentTrade) {
        let marketId = recentTrade.id;
        let orders = recentTrade.orders; 
        if(orders && orders[0]) {
          let order = orders[0];
          let reference = createRandomHash();

          newOrderParams = {
            marketId: marketId,
            price: order.price,
            size: order.size,
            side: order.side,
            timeInForce: order.timeInForce,
            expiration: order.expiresAt,
            type: order.type,
            reference: reference
          };
        }

        setOrderParams(newOrderParams);
      }
    }
  }, [data, error, loading]);

  useEffect(() => {
    if(orderParams) {
      let graphQL = `mutation {
  prepareOrderSubmit(
    marketId: "${orderParams.marketId}",
    price: "${orderParams.price}",
    size: "${orderParams.size}",
    side: ${orderParams.side},
    timeInForce: ${orderParams.timeInForce},
    expiration: "${orderParams.expiration}",
    type: ${orderParams.type},
    reference: "${orderParams.reference}",
  ) {
    blob
  }
}
`;

      setValue(graphQL);
    }
 }, [orderParams, setValue]);

  useEffect(() => {
    let error;
    if(!transactionDetails || !transactionDetails.pubKey || ! transactionDetails.token) {

      let output = <div className="walkthrough-custom-data">
        <div className="walkthrough-custom-data-row">VINCENT SAYS...</div>
        <div className="walkthrough-custom-data-row">To complete this step, a public key and bearer token must be provided.</div>
        <div className="walkthrough-custom-data-row">To obtain these, complete the previous step: "Wallets"</div>
      </div>;

      setCustomData({
        'error': error,
        'data': {},
        'output': output
      })
    }
  }, [transactionDetails, setCustomData]);

  return <div className="walkthrough-vega-transaction"></div>;
}

export default VegaTransaction;