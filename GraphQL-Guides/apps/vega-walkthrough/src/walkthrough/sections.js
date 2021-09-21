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

let sections = [
  {
    id: "introduction",
    title: "Introduction",
    graphQL: `{
  assets {
    name, symbol, totalSupply
  }
}`
  },
  {
    id: "markets",
    title: "Markets",
    graphQL: `{
  markets {
    name
  }
}`
  },
  {
    id: "subscriptions",
    title: "Subscriptions",
    graphQL: `subscription {
  orders {
    id, createdAt
  }
}`
  },
  {
    id: "traders",
    title: "Trader Information",
    graphQL: `{
  parties {
    id
  }
}`
  },
  {
    id: "orderswallet",
    title: "Placing Orders (1. Wallets)",
    jsxComponent: "VegaWallet"
  },
  {
    id: "orders",
    title: "Placing Orders (2. Preparing Order)",
    auth: true,
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
}
`,
graphQLOld: `mutation ($marketId: String, $price: String, $size: String, 
  $side: String, $timeInForce: String, $expiration: String,
  $type: String, $reference: String) {
prepareOrderSubmit(
marketId: "496ab9e8db8911859f5837c7c3df1f2c6456c5e59f5e9e226cc6a83991f8860c",
price: "100000",
size: "100",
side: Buy,
timeInForce: GTT,
expiration: "1947587683359",
type: Limit,
reference: "12345667",
) {
blob
}
}` 

  },
  {
    id: "events",
    title: "Streaming Events",
    graphQL: `{
  assets {
    name, symbol, totalSupply
  }
}`
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

let progressors = {
  "introduction": [
    data => {
      let success = false;
      let reason = '';
      let hasAssets = data.assets && data.assets.length;

      if(hasAssets) {
        let firstAsset = data.assets[0];

        if(hasKeys(firstAsset, ['name, symbol, totalSupply'])) {
          success = true;
        }
      }
      else {
        reason = 'no-assets-returned';
      }
      return {
        success: success, reason: reason
      }
    }
  ],
  "subscriptions": [

  ]
}

export { sections, progressors };