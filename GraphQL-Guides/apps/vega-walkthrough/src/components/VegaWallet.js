import { useState } from "react";
import { useEffect } from "react";



function VegaWallet(props) {
  const [token, setToken] = useState('');
  const [pubKey, setPubKey] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [signedTx, setSignedTx] = useState();

  const tx = props.tx;
  const propogate = props.propogate;

  let walletName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  let passPhrase = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  useEffect(() => {
    let url = 'https://wallet.testnet.vega.xyz/api/v1/wallets';
    let options = {
      method: 'POST',
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "wallet": walletName,
        "passphrase": passPhrase
      })
    } 

    setSubmitting(true);
    fetch(url, options).then(response => {
      return response.json();
    })
    .then(json => {
      setSubmitting(false);
      console.log(json);
      setToken(JSON.stringify(json));

      fetch('https://wallet.testnet.vega.xyz/api/v1/keys', {
        headers: {
          'Authorization': `Bearer ${json.token}`
        },
        body: JSON.stringify({
          "passphrase": passPhrase,
          "meta": [{"key": "alias", "value": "my_key_alias"}],
        })
      }).then(keysResponse=> {
        return keysResponse.json();
      }).then(keysJSON => {
        setPubKey(keysJSON['keys'][0]['pub'])
        console.log(keysJSON);
      }).catch(keysError => {
        console.log(keysError);
      });
    })
    .catch(error => {
          console.log(error);
          setSubmitting(false);
        }
    );
  }, [passPhrase, walletName]);

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

  return <div>{token}</div>
}

export default VegaWallet;