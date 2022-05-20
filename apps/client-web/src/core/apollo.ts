import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import * as ActionCable from '@rails/actioncable'
import ActionCableLink from 'graphql-ruby-client/subscriptions/ActionCableLink'
import { typePolicies } from './typePolicies'

const securityLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'X-CSRF-Token': globalThis.brickdocContext?.csrfToken
    }
  }
})

const httpLink = securityLink.concat(
  createHttpLink({
    uri: globalThis.brickdocContext?.internalApiEndpoint,
    credentials: 'same-origin'
  })
)

const nextUri = `https://${location.hostname}:3080/.internal-apis/$graph`

const nextLink = createHttpLink({
  uri: nextUri, // NOTE: fixed for dev
})

export const cable = ActionCable.createConsumer()

const websocketLink = new ActionCableLink({ cable, channelName: 'InternalGraphQLChannel' })

// If subscription operation or operation name end with 'FromWS' use WebSocket else use HTTP.
const brickdocLink = split(
  ({ query, operationName }) => {
    const definition = getMainDefinition(query)
    return (
      (definition.kind === 'OperationDefinition' && definition.operation === 'subscription') ||
      operationName.endsWith('FromWS')
    )
  },
  websocketLink,
  httpLink
)

const nextOperationNames: string[] = [
  'GetDocument',
  'SyncDocument'
]

// NOTE: temp split link to next version
const nextSplitLink = split(
  ({ operationName }) => {
    return nextOperationNames.includes(operationName)
  },
  nextLink,
  brickdocLink
)

export const apolloClient = new ApolloClient({
  link: nextSplitLink,
  cache: new InMemoryCache({ typePolicies })
})
