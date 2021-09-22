import { useEffect, useState } from "react";
import { gql, ApolloClient, useQuery } from '@apollo/client';
import {GraphQLTransactionSender} from './GraphQLTransactionSender';

function VegaTransactionSender(props) {
  const transactionDetails = props.transactionDetails;
  const setTransactionDetails = props.setTransactionDetails;
  const setCustomData = props.setCustomData;
  const setValue = props.setValue;

  const [submitting, setSubmitting] = useState(false);
  const [orderParams, setOrderParams] = useState();

  useEffect(() => {
    let error;
    if(transactionDetails) {
      if(transactionDetails.tx && transactionDetails.signedTx.sig) {
        let tx = transactionDetails.tx;
        let sigDetails = transactionDetails.signedTx.sig;
        let type = 'Sync'; // (Async|Sync|Commit)
        const submitTransaction = `
          mutation {
            submitTransaction {
              data: "${tx}",
              sig: {
                sig: "${sigDetails.sig}",
                algo: "${sigDetails.algo}",
                version: "${sigDetails.version}" 
              },
              type: ${type} 
            }
          }`;
      }
      else {
        error = "Both of transaction hash and the signature details were not provided.";
      }
    }
    else {
      error = "No transaction details were provided.";
    }
   const recentOrderQuery = `{
      markets {
        id, orders(first: 0, last: 1) {
          price, size, expiresAt, side, timeInForce, type, reference
        }
      }
    }`;
  
    const { loading, error, data } = useQuery(gql`${recentOrderQuery}`, { errorPolicy: 'all' })

  }, [transactionDetails, setTransactionDetails, setCustomData]);

  return <div className="walkthrough-vega-transaction-sender">
    <GraphQLTransactionSender />
  </div>;
}

export default VegaTransaction;