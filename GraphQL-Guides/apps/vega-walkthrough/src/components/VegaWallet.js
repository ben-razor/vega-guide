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

  const tx = props.tx;
  const propogate = props.propogate;
  const setOutput = props.setOutput;

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
      let outputText = '';
      if(json.error) {
        outputText = json.error;
      }
      else if(json.errors) {
        outputText = JSON.stringify(json.errors);
      }
      else {
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

        outputText = (
          <div>
            <div>Mnemonic: {mnemonic}</div>
            <div>Public key: {pubKey}</div>
          </div>
        )
      }

      setOutput(outputText);
   })
    .catch(error => {
          console.log(error);
          setSubmitting(false);
        }
    );
  }, [walletDetails]);

  useEffect(() => {
    if(pubKey && mnemonic) {
      setOutput(
        <div>
          <div>Mnemonic: {mnemonic}</div>
          <div>Public key: {pubKey}</div>
        </div>
      )
    }
  }, [pubKey, mnemonic, setOutput]);

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