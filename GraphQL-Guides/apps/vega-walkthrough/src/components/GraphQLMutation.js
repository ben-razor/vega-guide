import { useMutation } from "@apollo/client";
import { useEffect } from "react";
import { getResultsTable } from '../helpers/apollo_helpers';

function GraphQLMutation(props) {
  let query = props.query;
  let client = props.client;
  const [prepareOrder, { loading, error, data }] = useMutation(query, { client: client, errorPolicy: 'all' });
  
  let maxRecords = props.maxRecords;
  let resultsTable = getResultsTable(data, loading, error, maxRecords);

  useEffect(() => {
    prepareOrder({
      variables: {
        marketId: "496ab9e8db8911859f5837c7c3df1f2c6456c5e59f5e9e226cc6a83991f8860c",
        price: "100000",
        size: "100",
        side: "SIDE_BUY",
        timeInForce: "TIME_IN_FORCE_GTT",
        expiration: "1947587683359",
        type: "TYPE_LIMIT",
        reference: "12345667"
      }
    });
  }, [prepareOrder, query]);

  return <div className="results-graphql-query">
    {resultsTable}
  </div>;
}

export default GraphQLMutation;