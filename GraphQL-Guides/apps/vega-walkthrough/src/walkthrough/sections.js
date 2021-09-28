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
    title: "Placing Orders (2. Send Order)",
    auth: true,
    progressor: resultData => {
      let success = false;
      let reason = '';
      let data = resultData;

      if(data) {
        if(data.signature && data.signature.value) {
          success = true;
        }
        else {
          reason = 'Transaction signature was not in the result.'; 
        }
      }
      else {
        reason = 'no-data-returned';
      }
      return [
        success, reason
      ]
    },
    rest: `{
      "orderSubmission": {
        "marketId": "2201cba5132fcb6e3aa589484eea006a1846826e48978e0b4182b61d0eb0a2a2",
        "price": "10",
        "size": "34",
        "side": "SIDE_BUY",
        "timeInForce": "TIME_IN_FORCE_GTT",
        "expiresAt": 1632860434402000000,
        "type": "TYPE_LIMIT",
        "reference": "any_reference_you_like" 
    },
    "pubKey": "pubkey_is_entered_here",
    "propagate": "true"
}`
  },
  {
    id: "orderswrapup",
    title: "Placing Orders (3. Summary)",
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
    progressor: resultData => {
      let success = false;
      let reason = '';
      let rows = resultData.busEvents; 
      let hasRows = rows && rows.length > 0;

      if(hasRows) {
        let firstRow = rows[0]
        if(hasKeys(firstRow, ['event']) && firstRow.event.createdTimestamp) {
          success = true;
        }
        else {
          reason = 'The success field was not found in the results'; 
        }
      }
      else {
        reason = 'no-events-returned';
      }
      return [
        success, reason
      ]
    },
    graphQL: `subscription {
  busEvents(types: [TimeUpdate], batchSize: 1) {
    event {
      ... on TimeUpdate {
        timestamp
      }
    }
  }
}`
  },
  {
    id: "governance",
    title: "Governance",
    progressor: resultData => {
      let success = false;
      let reason = '';
      let rows = resultData.proposals; 
      let hasRows = rows && rows.length > 0;

      if(hasRows) {
        let firstRow = rows[0]
        if(hasKeys(firstRow, ['state', 'datetime', 'terms'])) {
          success = true;
        }
        else {
          reason = 'The success field was not found in the results'; 
        }
      }
      else {
        reason = 'no-events-returned';
      }
      return [
        success, reason
      ]
    },
    graphQL: `{
  proposals {
    state, datetime, terms {
      change {
        ... on NewMarket {
          instrument {
            name, code
          }
        }
      }
    } 
  }
}`
  },
  {
    id: "wrappingup",
    title: "Wrapping Up",
    jsxComponent: "WalkthroughWrapUp",
    runDisabled: true,
    graphQL: ``
  }
];

export { sections };