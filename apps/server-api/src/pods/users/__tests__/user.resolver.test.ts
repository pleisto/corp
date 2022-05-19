import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { gql } from 'apollo-server-fastify'
import { useAppInstanceWithGraphQL } from '../../../common/testing'
import { UserService } from '../user.service'
import type { ApolloServerBase } from 'apollo-server-core'
import { Session } from '../../../core/session/session.class'
import { SESSION_USER_KEY, UserSession } from '../../auth'
import { KMSService, SecretSubKey } from '../../../common/kms'
import { intEncrypt } from '@brickdoc/server-api-crate'
import { findUserByIdSpyFunction } from '../testing/mock-user.service'

describe('UserResolver', () => {
  let app: NestFastifyApplication
  let service: UserService
  let kms: KMSService
  let findUserByIdSpy: any

  let apollo: ApolloServerBase<any>
  const createInstance = useAppInstanceWithGraphQL(
    async (app, moduleRef) => {
      service = moduleRef.get<UserService>(UserService)
      findUserByIdSpy = jest.spyOn(service, 'findUserById').mockImplementation(findUserByIdSpyFunction)
    },
    async app => {
      findUserByIdSpy.mockRestore()
    }
  )

  beforeAll(async () => {
    const instance = (await createInstance)()
    apollo = instance[0]
    app = instance[1]
    kms = app.get<KMSService>(KMSService)
  })

  afterAll(async () => {
    await app.close()
  })

  const currentUserQuery = gql`
    query {
      currentUser {
        id
        name
      }
    }
  `

  it.todo('fix auth in graphql')

  // https://github.com/nestjs/graphql/issues/502
  // eslint-disable-next-line jest/no-disabled-tests
  it('currentUserQuery: user not found', async () => {
    const user: UserSession = { id: 0, slug: 'unmatched' }
    const session = new Session({ [SESSION_USER_KEY]: user })
    apollo.requestOptions.context = { req: { session } }
    const result = await apollo.executeOperation({ query: currentUserQuery })
    expect(result.errors).not.toBeUndefined()
    expect(result.errors![0].message).toContain('User not found')
  })

  it('currentUserQuery: Unauthorized', async () => {
    const session = new Session({})
    apollo.requestOptions.context = { req: { session } }
    const result = await apollo.executeOperation({ query: currentUserQuery })
    expect(result.errors).not.toBeUndefined()
    expect(result.errors![0].message).toContain('Unauthorized')
  })

  it('currentUserQuery: ok', async () => {
    const user = { id: 1, slug: 'existed' }
    const session = new Session({ [SESSION_USER_KEY]: user })
    apollo.requestOptions.context = { req: { session } }
    const result = await apollo.executeOperation({ query: currentUserQuery })
    expect(result.errors).toBeUndefined()
    expect(result.data?.currentUser.id).toBe(intEncrypt(user.id, kms.subKey(SecretSubKey.INT_ID_OBFUSCATION)))
  })
})
