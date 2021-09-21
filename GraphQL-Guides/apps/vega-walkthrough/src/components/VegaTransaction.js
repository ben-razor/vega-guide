import { useEffect } from "react";

function VegaTransaction(props) {
  const transactionDetails = props.transactionDetails;
  const setTransactionDetails = props.setTransactionDetails;
  const setCustomData = props.setCustomData;

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