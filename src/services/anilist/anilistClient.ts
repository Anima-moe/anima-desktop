import { ApolloClient, InMemoryCache } from '@apollo/client'

const GqlClient = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache()
})

export default GqlClient