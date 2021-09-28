import { useEffect, useState } from "react";
import { gql, useQuery } from '@apollo/client';
import { getResultsTable } from '../helpers/apollo_helpers';

function createRandomHash() {
  let hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return hash;
}

/**
 * Grab a recent transaction and create a new GraphQL order based on it.
 * 
 * @param {object} props 
 * @returns 
 */
function VegaTransaction(props) {
  const transactionDetails = props.transactionDetails;
  const setTransactionDetails = props.setTransactionDetails;
  const setCustomData = props.setCustomData;
  const setResultData = props.setResultData;
  const setValue = props.setValue;
  const rest = props.rest;

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

      let price = parseInt(orderParams.price, 10) || "10";
      let size = orderParams.size || "10";

      let pubKey = 'NO_PUBLIC_KEY_IS_PRESENT'
      if(transactionDetails.pubKey) {
        pubKey = transactionDetails.pubKey;
      }

      let date = new Date(orderParams.expiration);
      let timestamp = date.getTime() * 1e6;

      let rest = `{
  "orderSubmission": {
    "marketId": "${orderParams.marketId}",
    "price": "${price}",
    "size": "${size}",
    "side": "SIDE_${orderParams.side.toUpperCase()}",
    "timeInForce": "TIME_IN_FORCE_${orderParams.timeInForce.toUpperCase()}",
    "expiresAt": "${timestamp}",
    "type": "TYPE_${orderParams.type.toUpperCase()}",
    "reference": "${orderParams.reference}"
  },
  "pubKey": "${pubKey}",
  "propagate": true
}` ;

      setValue(rest);
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

  useEffect(() => {
    if(!rest) {
      return;
    }
    let error;
    let output;
    if(transactionDetails) {
      if(transactionDetails.pubKey && transactionDetails.token) {
        let url = 'https://wallet.testnet.vega.xyz/api/v1/command/sync';
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${transactionDetails.token}`
        }

        let options = {
          method: 'POST',
          headers : headers,
          body: rest.replaceAll(/[\n\r]/g, '')
        } 

        fetch(url, options).then(response => {
          return response.json();
        })
        .then(json => {
          console.log(json);

          if(json.error) {
            error = JSON.stringify(json.error);
          }
          else if(json.errors) {
            error = JSON.stringify(json.errors);
          }
          else {
            setResultData(json);

            output = <div>
              <div className="walkthrough-custom-data-row">Signature</div>
              <div className="walkthrough-custom-data-row">{json.signature.value}</div>
            </div> 
          }
          
          if(error) {
            output = <div>There is a syntax error in your query.<p>
              And it goes a little something like this...</p><p>{error}</p>
            </div>
          }

          setCustomData({
            'error': error,
            'data': json,
            'output': output
          });
        })
        .catch(error => {
            console.log(error);
          }
        );
      }
      else {
        error = "Public key and bearer token were not supplied."
        setCustomData({
          'error': error,
          'data': {},
          'output': <div className="walkthrough-custom-data">
            <div className="walkthrough-custom-data-row">{error}</div>
            <div className="walkthrough-custom-data-row">You may need to complete the previous steps.</div>
          </div>
        });
      }
    }
    else {
      error = "No transaction details were supplied.";
      setCustomData({
        'error': error,
        'data': {},
        'output': error 
      });
    }
  }, [rest, transactionDetails, setCustomData]);

  return <div className="walkthrough-vega-transaction"></div>;
}

export default VegaTransaction;