import { useState } from 'react';
import { useSubscription } from "@apollo/client";
import { getResultsTable } from '../helpers/apollo_helpers';            

function GraphQLSubscription(props) {
  let query = props.query;
  const [data, setData] = useState();
  const { loading, error, payload } = useSubscription(query, { 
    onSubscriptionData: data => setData(data?.subscriptionData?.data) 
  });
  
  let maxRecords = props.maxRecords;
  let resultsTable = getResultsTable(data, loading, error, maxRecords);

  return <div className="results-graphql-query">
    {resultsTable}
  </div>
}

export default GraphQLSubscription;