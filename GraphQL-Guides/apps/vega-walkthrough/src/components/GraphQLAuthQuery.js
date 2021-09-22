import React from 'react';
import { gql, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useEffect, useState } from 'react';
import GraphQLMutation from './GraphQLMutation';
import GraphQLTransactionSender from './GraphQLTransactionSender';

function GraphQLAuthQuery(props) {
  let query = props.query;
  let transactionDetails = props.transactionDetails;
  let setTransactionDetails = props.setTransactionDetails;
  const [client, setClient] = useState()
  const [error, setError] = useState();
  
  let maxRecords = props.maxRecords;
  let setResultData = props.setResultData;
  let section = props.section;

  useEffect(() => {
    if(transactionDetails && transactionDetails.token) {
      let token = transactionDetails.token;

      const httpLink = createHttpLink({
        uri: 'https://lb.testnet.vega.xyz/query'
      });

      const authLink = setContext((_, { headers }) => {
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
          }
        }
      });

      const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
        typeDefs: gql`
          enum Side {
            Buy,
            Sell 
          }

          enum OrderTimeInForce {
            FOK, IOC, GTC, GTT, GFA, GFN 
          }

          enum OrderType {
            Market, Limit, Network
          }

          enum SubmitTransactionType {
            Async, Sync, Commit
          }
        `
      });

      setError();
      setClient(client);
    }
    else {
      setError('Query error: Bearer token not supplied.')
    }
  }, [transactionDetails]);

  let GraphQLHandler;

  return <div className="results-graphql-query">
    { error ? 
      error :
      (
        client ?
        (
          section.id === 'ordersprepare' ?
          <GraphQLMutation query={query} client={client} maxRecords={maxRecords} setResultData={setResultData} 
                     transactionDetails={transactionDetails} setTransactionDetails={setTransactionDetails}
                     /> :
          <GraphQLTransactionSender query={query} client={client} maxRecords={maxRecords} setResultData={setResultData} 
          transactionDetails={transactionDetails} setTransactionDetails={setTransactionDetails}
          />
        ) :
        'Waiting for authenticated client to connect...'
      )
    }

  </div>;
}

export default GraphQLAuthQuery;