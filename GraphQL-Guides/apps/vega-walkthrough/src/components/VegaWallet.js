import { useState } from "react";
import { useEffect } from "react";

let orderDefaults = {
  "pub_key": "",
  "market_id": '496ab9e8db8911859f5837c7c3df1f2c6456c5e59f5e9e226cc6a83991f8860c',
  "price": 100000,
  "size": "100",
  "side": "SIDE_BUY",
  "time_in_force": "TIME_IN_FORCE_GTT",
  "expires_at": "",
  "type": "TYPE_LIMIT",
  "reference": ""
}

function createOrder(
  pubKey, 
  marketID, 
  reference,
  expiresAt,
  propogate = true, 
  price = 100000, 
  size = 100, 
  side = "SIDE_BUY", 
  timeInForce = "TIME_IN_FORCE_GTT",
  type = "TYPE_LIMIT", 
)
{
  let order = `
    "pub_key": "${pubKey}",
    "propagate": ${propogate},
    "order_submission": {
        "market_id": "${marketID}",
        "price": "${price}",
        "size": "${size}",
        "side": "${side}",
        "time_in_force": "${timeInForce}",
        "expires_at": "${expiresAt}",
        "type": "${type}",
        "reference": "${reference}"
    }
  `;
  return order;
}

function VegaWallet(props) {
  const [token, setToken] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
  }, []);

  return <div>{token}</div>
}

export default VegaWallet;