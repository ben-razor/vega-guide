import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { getResultsTable } from '../helpers/apollo_helpers';

/**
 * Wrapper around an Apollo useMutation call to execute a Vega prepareOrderSubmit mutation.
 * 
 * @param {object} props 
 * @returns 
 */
function GraphQLOrderPrepare(props) {
  let query = props.query;
  let client = props.client;
  let setResultData = props.setResultData;
  let transactionDetails = props.transactionDetails;
  let setTransactionDetails = props.setTransactionDetails;
  const [blob, setBlob] = useState();

  const [prepareOrder, { loading, error, data }] = useMutation(query, { client: client, errorPolicy: 'all' });
  
  useEffect(() => {
    if(!error && data && data.prepareOrderSubmit && data.prepareOrderSubmit.blob !== blob) {
      setTimeout(() => { 
        setResultData(data); 

        let txData = data.prepareOrderSubmit;

        if(txData) {
          if('blob' in txData) {
            let newTransactionDetails = {...transactionDetails};
            newTransactionDetails.txHash = txData.blob;
            setTransactionDetails(newTransactionDetails);
            setBlob(txData.blob);
          }
        }
      }, 0);
    }
  }, [error, data, setResultData, setTransactionDetails, transactionDetails, blob])

  let maxRecords = props.maxRecords;
  let resultsTable = getResultsTable(data, loading, error, maxRecords);

  useEffect(() => {
    prepareOrder();
  }, [prepareOrder, query]);

  return <div className="results-graphql-query">
    {resultsTable}
  </div>;
}

export default GraphQLOrderPrepare;