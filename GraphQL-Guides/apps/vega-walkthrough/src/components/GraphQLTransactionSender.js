import { useMutation } from "@apollo/client";
import { useEffect } from "react";
import { getResultsTable } from '../helpers/apollo_helpers';

/**
 * Wrapper around an Apollo useMutation call to execute a Vega submitTransaction mutation.
 * 
 * @param {object} props 
 * @returns 
 */
function GraphQLTransactionSender(props) {
  let query = props.query;
  let client = props.client;
  let setResultData = props.setResultData;
  let transactionDetails = props.transactionDetails;
  let setTransactionDetails = props.setTransactionDetails;

  const [prepareOrder, { loading, error, data }] = useMutation(query, { client: client, errorPolicy: 'all' });
  
  useEffect(() => {
    if(!error && data) {
      setTimeout(() => { 
        setResultData(data); 
     }, 0);
    }
  }, [error, data, setResultData])

  let maxRecords = props.maxRecords;
  let resultsTable = getResultsTable(data, loading, error, maxRecords);

  useEffect(() => {
    prepareOrder();
  }, [prepareOrder, query]);

  return <div className="results-graphql-query">
    {resultsTable}
  </div>;
}

export default GraphQLTransactionSender;