import { useEffect } from "react";

/**
 * Despite the name, this does not send transactions. It creates GraphQL code for 
 * sending a transaction when it is provided the results of a sign transaction call
 * from the Vega Wallet REST API.
 * 
 * It then calls setValue to enter the GraphQL into the editor ready to be run.
 * 
 * @param {object} props 
 * @returns 
 */
function VegaTransactionSender(props) {
  const transactionDetails = props.transactionDetails;
  const setTransactionDetails = props.setTransactionDetails;
  const setCustomData = props.setCustomData;
  const setValue = props.setValue;
  const setRunDisabled = props.setRunDisabled;

  useEffect(() => {
    let error;
    if(transactionDetails) {
      if(transactionDetails.txHash && transactionDetails.signedTx.sig) {
        let sigDetails = transactionDetails.signedTx.sig;
        let type = 'Sync'; // (Async|Sync|Commit)
        const submitTransaction = `mutation {
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
        setValue(submitTransaction);
        setRunDisabled(false);
      }
      else {
        error = "Both of transaction hash and the signature details were not provided.";
      }
    }
    else {
      error = "No transaction details were provided."; 
    }
  }, [transactionDetails, setTransactionDetails, setCustomData, setRunDisabled, setValue]);

  return <div className="walkthrough-vega-transaction-sender"></div>;
}

export default VegaTransactionSender;