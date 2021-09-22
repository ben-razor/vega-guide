import { useEffect, useState } from "react";
import { gql, ApolloClient, useQuery } from '@apollo/client';
import GraphQLTransactionSender from './GraphQLTransactionSender';
import GraphQLAuthQuery from './GraphQLAuthQuery';

const MAX_RECORDS = 5;
function VegaTransactionSender(props) {
  const transactionDetails = props.transactionDetails;
  const setTransactionDetails = props.setTransactionDetails;
  const setCustomData = props.setCustomData;
  const setResultData = props.setResultData;
  const setValue = props.setValue;
  const section = props.section;

  const [submitting, setSubmitting] = useState(false);
  const [orderParams, setOrderParams] = useState();
  const [submitTxQuery, setSubmitTxQuery] = useState();

  useEffect(() => {
    let error;
    if(transactionDetails) {
      if(transactionDetails.txHash && transactionDetails.signedTx.sig) {
        let tx = transactionDetails.txHash;
        let sigDetails = transactionDetails.signedTx.sig;
        let type = 'Sync'; // (Async|Sync|Commit)
        const submitTransaction = `
          mutation {
            submitTransaction (
              data: "${transactionDetails.signedTx.tx}",
              sig: {
                sig: "${sigDetails.sig}",
                algo: "${sigDetails.algo}",
                version: ${sigDetails.version}
              },
              type: ${type} 
            ) {
              success
            }
          }`;

        setSubmitTxQuery(gql`${submitTransaction}`);
      }
      else {
        error = "Both of transaction hash and the signature details were not provided.";
      }
    }
    else {
      error = "No transaction details were provided."; 
    }
  }, [transactionDetails, setTransactionDetails, setCustomData]);


  let client;

  if(submitTxQuery) {
    client = <GraphQLAuthQuery query={submitTxQuery}
                                transactionDetails={transactionDetails}
                                setTransactionDetails={setTransactionDetails}
                                maxRecords={MAX_RECORDS} setResultData={setResultData}
                                section={section} />
  }

  return <div className="walkthrough-vega-transaction-sender">
    {client}
  </div>;
}

export default VegaTransactionSender;