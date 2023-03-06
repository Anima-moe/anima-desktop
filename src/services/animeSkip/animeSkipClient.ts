import { ApolloClient, InMemoryCache } from '@apollo/client'

const GqlClient = new ApolloClient({
  uri: 'https://api.anime-skip.com/graphql',
  cache: new InMemoryCache(),
  headers: {
    'X-Client-ID': 'BH97RA09nVdL3shyhAStrJs5Cv3qAHMJ',
  },
})

export default GqlClient
