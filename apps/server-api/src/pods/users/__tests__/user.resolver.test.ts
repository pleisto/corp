import { Test, TestingModule } from '@nestjs/testing'
import { gql } from 'apollo-server-fastify'
import { AppModule } from '../../../app.module'
import { useAppInstanceWithGraphQL } from '../../../common/testing'
import { UserService } from '../user.service'
import type { ApolloServerBase } from 'apollo-server-core'
import { Session } from '../../../core/session/session.class'
import { SESSION_USER_KEY, UserSession } from '../../auth'
import { MaskId } from '../../../common/utils'

describe('UserResolver', () => {
  let module: TestingModule
  let service: UserService

  let apollo: ApolloServerBase<any>
  const instance = useAppInstanceWithGraphQL()

  beforeAll(async () => {
    apollo = (await instance)()[0]
  })

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    service = module.get<UserService>(UserService)
  })

  const profileQuery = gql`
    query {
      profile {
        id
        name
      }
    }
  `

  it.todo('fix auth in graphql')

  // https://github.com/nestjs/graphql/issues/502
  // eslint-disable-next-line jest/no-disabled-tests
  it('profile: user not found', async () => {
    const user: UserSession = { id: 123123, slug: 'unmatched' }
    const session = new Session({ [SESSION_USER_KEY]: user })
    apollo.requestOptions.context = { req: { session } }
    const result = await apollo.executeOperation({ query: profileQuery })
    expect(result.errors).not.toBeUndefined()
    expect(result.errors![0].message).toContain('Resource not found.')
  })

  it('profile: Unauthorized', async () => {
    const session = new Session({})
    apollo.requestOptions.context = { req: { session } }
    const result = await apollo.executeOperation({ query: profileQuery })
    expect(result.errors).not.toBeUndefined()
    expect(result.errors![0].message).toContain('Unauthorized')
  })

  it('profile: ok', async () => {
    const userResult = await service.findOrCreateUser({
      provider: 'test',
      subject: '1234',
      name: 'foobar',
      avatarUrl: null,
      bio: null,
      locale: null,
      meta: {}
    })
    expect(userResult.isOk()).toBe(true)
    const user = userResult._unsafeUnwrap()
    const session = new Session({ [SESSION_USER_KEY]: user })
    apollo.requestOptions.context = { req: { session } }
    const result = await apollo.executeOperation({ query: profileQuery })
    expect(result.errors).toBeUndefined()
    expect(result.data?.profile.id).toBe(MaskId(user.id))
  })
})
