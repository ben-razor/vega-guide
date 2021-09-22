import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { getResultsTable } from '../helpers/apollo_helpers';

function GraphQLMutation(props) {
  let query = props.query;
  let client = props.client;
  let setResultData = props.setResultData;
  let transactionDetails = props.transactionDetails;
  let setTransactionDetails = props.setTransactionDetails;
  const [blob, setBlob] = useState();

  let staticQuery = gql`
    mutation {
      prepareOrderSubmit(
        marketId: "2201cba5132fcb6e3aa589484eea006a1846826e48978e0b4182b61d0eb0a2a2",
        price: "13284845",
        size: "26",
        side: Buy,
        timeInForce: GTT,
        expiration: "2021-09-22T17:37:51.849925031Z",
        type: Limit,
        reference: "35ne6e68sn5ivmgwwgutwc",
      ) {
        blob
      }
    }
  `;
  const [prepareOrder, { loading, error, data }] = useMutation(staticQuery, { client: client, errorPolicy: 'all' });
  
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
  }, [error, data, setResultData, setTransactionDetails, transactionDetails])

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