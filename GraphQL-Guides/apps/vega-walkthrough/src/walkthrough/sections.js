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
    name, symbol, totalSupply
  }
}`
  },
  {
    id: "subscriptions",
    title: "Subscriptions",
    graphQL: `{
  assets {
    name, symbol, totalSupply
  }
}`
  },
  {
    id: "traders",
    title: "Trader Information",
    graphQL: `{
  assets {
    name, symbol, totalSupply
  }
}`
  },
  {
    id: "orders",
    title: "Placing Orders",
    graphQL: `{
  assets {
    name, symbol, totalSupply
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