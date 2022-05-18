import { Test, TestingModule } from '@nestjs/testing'
import { gql } from 'apollo-server-fastify'
import { AppModule } from '../../../app.module'
import { useAppInstanceWithGraphQL } from '../../../common/testing'
import { mockUserService } from '../testing/mock-user.service'
import { UserResolver } from '../user.resolve'
import { UserService } from '../user.service'
import type { ApolloServerBase } from 'apollo-server-core'

describe('UserResolver', () => {
  let resolver: UserResolver
  let module: TestingModule

  let apollo: ApolloServerBase<any>
  const instance = useAppInstanceWithGraphQL()

  beforeAll(async () => {
    apollo = (await instance)()[0]
  })

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile()
    resolver = module.get<UserResolver>(UserResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  it('profile', async () => {
    const user = await resolver.profile({ id: 123, slug: 'foo' })
    expect(user.name).toEqual('User 123')
  })

  // https://github.com/nestjs/graphql/issues/502
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should return profile', async () => {
    const query = gql`
      query {
        profile {
          id
          name
        }
      }
    `
    apollo.requestOptions.context = { foo: 'bar' }
    const result = await apollo.executeOperation({ query })
    console.log('result', result)
    expect(result.errors).toBeUndefined()
    expect(result.data?.metadata?.supportedLocales?.length).toBeGreaterThanOrEqual(1)
  })
})
