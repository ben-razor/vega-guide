import { useState } from "react";
import { useEffect } from "react";
import { formatObject } from '../helpers/apollo_helpers';

function VegaWallet(props) {
  const [token, setToken] = useState('');
  const [pubKey, setPubKey] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [signedTx, setSignedTx] = useState();
  const [walletName, setWalletName] = useState('');
  const [passPhrase, setPassPhrase] = useState('');
  const [walletDetails, setWalletDetails] = useState();
  const [error, setError] = useState('');

  const tx = props.tx;
  const propogate = props.propogate;
  const setCustomData = props.setCustomData;
  const setResultData = props.setResultData;
  const setTransactionDetails = props.setTransactionDetails;
  const section = props.section;

  useEffect(() => {

    if(!walletDetails) {
      return;
    }

    let url = 'https://wallet.testnet.vega.xyz/api/v1/wallets';
    let options = {
      method: 'POST',
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "wallet": walletDetails.walletName,
        "passphrase": walletDetails.passPhrase
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
        setError(json.error);
      }
      else if(json.errors) {
        setError(JSON.stringify(json.errors));
      }
      else {
        setError();
        setToken(json.token);
        setMnemonic(json.mnemonic);

        fetch('https://wallet.testnet.vega.xyz/api/v1/keys', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${json.token}`
          },
          body: JSON.stringify({
            "passphrase": walletDetails.passPhrase,
            "meta": [{"key": "alias", "value": "my_key_alias"}],
          })
        }).then(keysResponse=> {
          return keysResponse.json();
        }).then(keysJSON => {
          setPubKey(keysJSON.key.pub)
         
          console.log(keysJSON);
        }).catch(keysError => {
          console.log(keysError);
        });
      }
   })
    .catch(error => {
          console.log(error);
          setSubmitting(false);
        }
    );
  }, [walletDetails]);

  useEffect(() => {
    let output;
    if(error) {
      output = error;
    }
    else {
      output = <div className="walkthrough-custom-data">
        <div className="walkthrough-custom-data-row">Public key: {pubKey}</div>
        <div className="walkthrough-custom-data-row">Mnemonic: {mnemonic}</div>
        <div className="walkthrough-custom-data-row walkthrough-bearer-token">Bearer Token: {token}</div>
      </div>;
    }

    setTransactionDetails({
      pubKey: pubKey,
      token: token
    });


    setCustomData({
      'error': error,
      'data': {
        token: token,
        pubKey: pubKey,
        mnemonic: mnemonic
      },
      'output': output 
    });

    setResultData({
      'data': {
        token: token,
        pubKey: pubKey,
        mnemonic: mnemonic
      }
    });
  }, [pubKey, mnemonic, error, token, setCustomData, setTransactionDetails]);

  useEffect(() => {
    if(tx && token && pubKey) {
      let url = 'https://wallet.testnet.vega.xyz/api/v1/messages';
      let options = {
        method: 'POST',
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          "tx": tx,
          "pubKey": pubKey,
          "propogate": propogate
        })
      } 

      fetch(url, options).then(response => {
        return response.json();
      })
      .then(json => {
        setSubmitting(false);
        console.log(json);
        setToken(JSON.stringify(json));
        setSignedTx(json);
      })
      .catch(error =>{
        console.log(error);
      })
    }
  }, [tx, token, pubKey, propogate]);

  function handleDetailsSubmit(event) {
    let walletDetails = {
      walletName: walletName,
      passPhrase: passPhrase
    }
    setWalletDetails(walletDetails);
    event.preventDefault();
  }

  return <div className="walkthrough-details-form-panel">
    <form className="walkthrough-details-form" onSubmit={handleDetailsSubmit}>
      <div className="walkthrough-details-form-row">
        <label htmlFor="name">Wallet name: </label>
        <input className="walkthrough-details-form-input" type="text" value={walletName} onChange={e => setWalletName(e.target.value) } />
      </div>
      <div className="walkthrough-details-form-row">
        <label htmlFor="name">Pass phrase: </label>
        <input className="walkthrough-details-form-input" type="text" value={passPhrase} onChange={e => setPassPhrase(e.target.value) } />
      </div>
      <div className="walkthrough-details-form-row">
        <input className="ordinary-button" type="submit" name="submit" value="Create Wallet" />
      </div>
    </form>
  </div>
}

export default VegaWallet;