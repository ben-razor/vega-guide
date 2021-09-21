import { gql, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useEffect, useState } from 'react';
import GraphQLMutation from './GraphQLMutation';

function GraphQLAuthQuery(props) {
  let query = props.query;
  let token = props.token;
  const [client, setClient] = useState()
  
  let maxRecords = props.maxRecords;

  useEffect(() => {
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
      `
    });

    setClient(client);
  }, [token]);

  return <div className="results-graphql-query">
    { client ?
      <GraphQLMutation query={query} client={client} maxRecords={maxRecords} /> :
      'Waiting for authenticated client to connect...'
    }
  </div>;
}

export default GraphQLAuthQuery;