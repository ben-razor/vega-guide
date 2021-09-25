import { useState } from "react";
import { useEffect } from "react";

/**
 * Displays a form to enter a wallet name and pass phrase.
 * 
 * Uses the Vega Protocol Wallet REST API to create a wallet based on the details.
 * 
 * After the wallet is created, calls the REST API keys method to generate a public
 * key.
 * 
 * @param {object} props 
 * @returns 
 */
function VegaWallet(props) {
  const [token, setToken] = useState('');
  const [pubKey, setPubKey] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [walletName, setWalletName] = useState('');
  const [passPhrase, setPassPhrase] = useState('');
  const [walletDetails, setWalletDetails] = useState();
  const [error, setError] = useState('');

  const setCustomData = props.setCustomData;
  const setResultData = props.setResultData;
  const setTransactionDetails = props.setTransactionDetails;

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

    fetch(url, options).then(response => {
      return response.json();
    })
    .then(json => {
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
        }).catch(keysError => {
          console.log(keysError);
        });
      }
    })
    .catch(error => {
          console.log(error);
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
  }, [pubKey, mnemonic, error, token, setCustomData, setTransactionDetails, setResultData]);

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
        <label className="walkthrough-details-form-label" htmlFor="name">Wallet name: </label>
        <input className="walkthrough-details-form-input" type="text" value={walletName} onChange={e => setWalletName(e.target.value) } />
      </div>
      <div className="walkthrough-details-form-row">
        <label className="walkthrough-details-form-label" htmlFor="name">Pass phrase: </label>
        <input className="walkthrough-details-form-input" type="text" value={passPhrase} onChange={e => setPassPhrase(e.target.value) } />
      </div>
      <div className="walkthrough-details-form-row">
        <input className="ordinary-button" type="submit" name="submit" value="Create Wallet" />
      </div>
    </form>
  </div>
}

export default VegaWallet;