import { useQuery } from "@apollo/client";
import { getResultsTable } from '../helpers/apollo_helpers';

function GraphQLQuery(props) {
  let query = props.query;
  const { loading, error, data } = useQuery(query, { errorPolicy: 'all' });
  
  let maxRecords = props.maxRecords;
  let resultsTable = getResultsTable(data, loading, error, maxRecords);

  return <div className="results-graphql-query">
    {resultsTable}
  </div>;
}

export default GraphQLQuery;