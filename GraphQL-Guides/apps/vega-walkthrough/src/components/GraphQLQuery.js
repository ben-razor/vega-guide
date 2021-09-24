import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { getResultsTable } from '../helpers/apollo_helpers';

/**
 * Wrapper around the Apollo useQuery hook.
 * 
 * @param {object} props 
 * @returns 
 */
function GraphQLQuery(props) {
  let query = props.query;
  let maxRecords = props.maxRecords;
  let setResultData = props.setResultData;

  const { loading, error, data } = useQuery(query, { errorPolicy: 'all' });
  
  useEffect(() => {
    if(!error && data) {
      setTimeout(() => { setResultData(data); }, 0);
    }
  }, [error, data, setResultData])

  let resultsTable = getResultsTable(data, loading, error, maxRecords);

  return <div className="results-graphql-query">
    {resultsTable}
  </div>;
}

export default GraphQLQuery;