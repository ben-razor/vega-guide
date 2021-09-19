const initialQueryText = `{
  markets {
    id, name 
  }
}`;

const marketDetailsQueryText = `{
  markets {
    name, orders {
      size, price
    }
  }
}`;

const assetQueryText = `{
  assets {
    name, symbol, totalSupply
  }
}`;

const statisticsQueryText = `{
  statistics {
    totalTrades, tradesPerSecond, upTime, totalPeers
  }
}`;

const templateQueries = {
  'markets-name': initialQueryText,
  'markets-details': marketDetailsQueryText,
  'assets': assetQueryText,
  'statistics': statisticsQueryText
}

export default templateQueries;

