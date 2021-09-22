import { useState, useEffect } from 'react';
import { useSubscription } from "@apollo/client";
import { getResultsTable } from '../helpers/apollo_helpers';            

function GraphQLSubscription(props) {
  let query = props.query;
  let setResultData = props.setResultData;

  const [data, setData] = useState();
  const [currentFields, setCurrentFields] = useState([]);

  const { loading, error, payload } = useSubscription(query, { 
    onSubscriptionData: data => setData(data?.subscriptionData?.data) 
  });

  useEffect(() => {
    if(!error && data) {
      let groups = Object.keys(data);
      let rows;
      if(groups && groups[0]) {
        rows = data[groups[0]];

        if(rows[0]) {
          let fields = Object.keys(rows[0])
          let sameFields = fields.every(x => currentFields.includes(x)) && 
                           currentFields.every(x => fields.includes(x))

          if(!sameFields) {
            setCurrentFields(fields.slice());
            setTimeout(() => { setResultData(data); }, 0);
          }
        }
      }
    }
  }, [error, data, setResultData])

  let maxRecords = props.maxRecords;
  let resultsTable = getResultsTable(data, loading, error, maxRecords);

  return <div className="results-graphql-query">
    {resultsTable}
  </div>
}

export default GraphQLSubscription;