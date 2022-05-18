import request from 'supertest'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { useAppInstanceWithHttp } from '@brickdoc/server-api/src/common/testing'

describe('MockAuth', () => {
  let app: NestFastifyApplication

  const instance = useAppInstanceWithHttp()

  beforeAll(async () => {
    app = (await instance)()
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
