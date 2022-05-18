import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { MockAuthModule } from '../mock-auth.module'
import { UserService } from '@brickdoc/server-api/src/accounts/users'
import request from 'supertest'

describe('MockAuth', () => {
  let app: INestApplication
  const userService = { findAll: () => ['test'] }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [MockAuthModule]
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it.todo('fix mock test')

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('/GET /mock/hello', async () => {
    const result = await request(app.getHttpServer()).get('/mock/hello')
    console.log('result', result)
    expect(result.status).toBe(200)
    expect(result.body).toEqual({ data: { hello: 'test' } })
  })

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('/GET /mock/login_as_real_user', () => {
    request(app.getHttpServer()).get('/mock/login_as_real_user?slug=foobar').expect(200)
  })
})
