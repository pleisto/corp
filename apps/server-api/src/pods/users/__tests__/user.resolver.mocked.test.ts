import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../../app.module'
import { mockUserService } from '../testing/mock-user.service'
import { UserResolver } from '../user.resolve'
import { UserService } from '../user.service'
describe('UserResolver', () => {
  let resolver: UserResolver
  let module: TestingModule

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile()
    resolver = module.get<UserResolver>(UserResolver)
  })

  afterAll(async () => {
    await module?.close()
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  it('profile', async () => {
    const user = await resolver.profile({ id: 123, slug: 'foo' })
    expect(user.name).toEqual('User 123')
  })
})
