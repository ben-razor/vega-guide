function hasKeys(obj, keys) {
  let success = true;

  for(let key of keys) {
    if(!(key in obj)) {
      success = false;
      break;
    }
  }
  return success;
}

let unusedSections = [
  {
    id: "inlinefragments",
    titile: "Inline Fragments",
    graphQL: `{
  markets {
    name, tradableInstrument {
      instrument { 
        product {
          ... on Future {
            settlementAsset {
              symbol
            }
          }
        }
      }
    }
  }
}
    `
  }
]

let sections = [
  {
    id: "introduction",
    title: "Introduction",
    progressor: resultData => {
      let success = false;
      let reason = '';
      let hasAssets = resultData.assets && resultData.assets.length;

      if(hasAssets) {
        let firstAsset = resultData.assets[0];

        if(hasKeys(firstAsset, ['name', 'symbol', 'totalSupply'])) {
          success = true;
        }
        else {
          reason = 'Fields name, symbol and totalSupply are not in the results.'; 
        }
      }
      else {
        reason = 'no-assets-returned';
      }
      return [
        success, reason
      ]
    },
    graphQL: `{
  assets {
    name, symbol, totalSupply
  }
}`
  },
  {
    id: "markets",
    title: "Markets",
    progressor: resultData => {
      let success = false;
      let reason = '';
      let rows = resultData.markets;
      let hasRows = rows && rows.length;

      if(hasRows) {
        let firstRow = rows[0];

        if(hasKeys(firstRow, ['data', 'name', 'state'])) {
          success = true;
        }
        else {
          reason = 'Fields data, name and state are not in the results.'; 
        }
      }
      else {
        reason = 'no-markets-returned';
      }
      return [
        success, reason
      ]
    },
    graphQL: `{
  markets {
    name
  }
}`
  },
  {
    id: "subscriptions",
    title: "Subscriptions",
    progressor: resultData => {
      let success = false;
      let reason = '';
      let rows = resultData.orders;
      let hasRows = rows && rows.length;

      if(hasRows) {
        let firstRow = rows[0];

        if(hasKeys(firstRow, ['createdAt', 'market', 'size'])) {
          success = true;
        }
        else {
          reason = 'Fields createdAt, market and size are not in the results.'; 
        }
      }
      else {
        reason = 'no-orders-returned';
      }
      return [
        success, reason
      ]
    },
    graphQL: `subscription {
  orders {
    id, createdAt
  }
}`
  },
  {
    id: "traders",
    title: "Trader Information",
    progressor: resultData => {
      let success = false;
      let reason = '';
      let rows = resultData.parties;
      let hasRows = rows && rows.length;

      if(hasRows) {
        let firstRow = rows[0];

        if(hasKeys(firstRow, ['trades'])) {
          success = true;
        }
        else {
          reason = 'The trades field is not in the results.'; 
        }
      }
      else {
        reason = 'no-parties-returned';
      }
      return [
        success, reason
      ]
    },
    graphQL: `{
  parties {
    id
  }
}`
  },
  {
    id: "orderswallet",
    title: "Placing Orders (1. Wallets)",
    progressor: resultData => {
      let success = false;
      let reason = '';
      let data = resultData.data; 

      if(data) {

        if(hasKeys(data, ['token', 'pubKey', 'mnemonic'])) {
          success = true;
        }
        else {
          reason = 'All fields token, pubKey and mnemonic are not in the results.'; 
        }
      }
      else {
        reason = 'no-data-returned';
      }
      return [
        success, reason
      ]
    },
    jsxComponent: "VegaWallet",
    runDisabled: true
  },
  {
    id: "ordersprepare",
    title: "Placing Orders (2. Prepare Order)",
    auth: true,
    progressor: resultData => {
      let success = false;
      let reason = '';
      let data = resultData.prepareOrderSubmit;

      if(data) {
        if(hasKeys(data, ['blob'])) {
          success = true;
        }
        else {
          reason = 'Transaction has blob is not in the results.'; 
        }
      }
      else {
        reason = 'no-data-returned';
      }
      return [
        success, reason
      ]
    },
    graphQL: `mutation {
  prepareOrderSubmit(
    marketId: "496ab9e8db8911859f5837c7c3df1f2c6456c5e59f5e9e226cc6a83991f8860c",
    price: "100000",
    size: "100",
    side: Buy,
    timeInForce: GTT,
    expiration: "2022-01-02T15:04:05Z",
    type: Limit,
    reference: "12345667",
  ) {
    blob
  }
}`
  },
  {
    id: "orderssend",
    title: "Placing Orders (3. Send Tx)",
    runDisabled: true,
    progressor: resultData => {
      let success = false;
      let reason = '';
      let result = resultData.submitTransaction; 

      if(result) {
        if(hasKeys(result, ['success'])) {
          success = true;
        }
        else {
          reason = 'The success field was not found in the results'; 
        }
      }
      else {
        reason = 'no-data-returned';
      }
      return [
        success, reason
      ]
    },
    graphQL: `mutation {
  submitTransaction(
    info: "GraphQL submitTransaction query will appear here when the transaction has been signed."
    
    info2: "Signing with the Vega REST API will take place if all the information from the previous steps have been provided") {
  }
}`
  },
  {
    id: "orderswrapup",
    title: "Placing Orders (4. Wrapping Up)",
    jsxComponent: "VegaOrdersWrapUp",
    runDisabled: true,
    progressor: resultData => {
      let reason = '';
      let success = resultData;

      return [
        success, reason
      ]
    }
  },
  {
    id: "events",
    title: "Streaming Events",
    graphQL: `subscription {
  busEvents(types: TimeUpdate, batchSize: 1) {
    event {
      ... on TimeUpdate {
        timestamp
      }
    }
  }
}
`
  },
  {
    id: "governance",
    title: "Governance",
    graphQL: `{
  assets {
    name, symbol, totalSupply
  }
}`
  }
];

export { sections };