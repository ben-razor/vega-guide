import { useEffect, useState } from "react";
import VegaTransactionSender from "./VegaTransactionSender";

function VegaTransactionSigner(props) {
  const transactionDetails = props.transactionDetails;
  const setTransactionDetails = props.setTransactionDetails;
  const setCustomData = props.setCustomData;
  const setValue = props.setValue;
  const setResultData = props.setResultData;
  const setRunDisabled = props.setRunDisabled;

  const section = {id: 'orderssign'};

  const [submitting, setSubmitting] = useState(false);
  const [orderParams, setOrderParams] = useState();

  useEffect(() => {
    let error;
    if(transactionDetails) {
      if(!transactionDetails.signature) {
        if(transactionDetails.txHash && transactionDetails.pubKey) {

          let url = 'https://wallet.testnet.vega.xyz/api/v1/messages';
          const headers = {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${transactionDetails.token}`
          }

          let newTransactionDetails;
          let options = {
            method: 'POST',
            headers : headers,
            body: JSON.stringify({
              "tx": transactionDetails.txHash,
              "pubKey": transactionDetails.pubKey,
              "propogate": true
            })
          } 

          setSubmitting(true);

          fetch(url, options).then(response => {
            return response.json();
          })
          .then(json => {
            setSubmitting(false);
            console.log(json);

            if(json.error) {
              error = JSON.stringify(json.error);
            }
            else if(json.errors) {
              error = JSON.stringify(json.errors);
            }
            else {
              newTransactionDetails = {...transactionDetails};
              /**
               * Fields in json: {
               *  base64Bundle,
               *  hexBundle,
               *  signedTx: {
               *    sig: {
               *      algo,
               *      sig,
               *      version
               *    }
               *    tx
               *  }
               * }
               */
              newTransactionDetails.signature = json.signedTx.sig.sig;
              newTransactionDetails.signedTx = json.signedTx;
              setTransactionDetails(newTransactionDetails);
            }

            let output;
            if(error) {
              output = error;
            }
            else {
              output = <div className="walkthrough-custom-data">
                  <div className="walkthrough-custom-data-row">
                    The order was signed using the Vega REST API.
                  </div>
                  <div className="walkthrough-custom-data-row">
                    Signature:
                  </div>
                  <div className="walkthrough-custom-data-row">
                    {newTransactionDetails.signature} 
                  </div>
                </div>;
            }
            
            setCustomData({
              'error': error,
              'data': {...newTransactionDetails},
              'output': output
            });
          })
          .catch(error => {
              console.log(error);
              setSubmitting(false);
            }
          );
        }
        else {
          error = "All of transaction hash, public key and bearer token were not supplied."
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
    }
    else {
      error = "No transaction details were supplied.";
      setCustomData({
        'error': error,
        'data': {},
        'output': error 
      });
    }
  }, [transactionDetails, setTransactionDetails, setCustomData]);


  let transactionSender;

  if(transactionDetails && transactionDetails.signedTx) {
    
    transactionSender = <VegaTransactionSender transactionDetails={transactionDetails}
                       setTransactionDetails={setTransactionDetails} setCustomData={setCustomData}
                       setResultData={setResultData} setValue={setValue}
                       section={section} setRunDisabled={setRunDisabled} />
  }

  return <div className="walkthrough-vega-transaction-signer">
    {transactionSender}
  </div>;
}

export default VegaTransactionSigner;