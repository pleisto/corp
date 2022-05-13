import { createMockPool, createMockQueryResult } from '@brickdoc/nestjs-slonik'
import { getPoolToken } from '@brickdoc/nestjs-slonik/src/slonik.utils'
import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '../user.service'

describe('UsersService mocked', () => {
  let userService: UserService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getPoolToken(),
          useValue: createMockPool({
            query: async () => {
              return createMockQueryResult([
                {
                  foo: 'bar'
                }
              ])
            }
          })
        },
        UserService
      ]
    }).compile()

    userService = app.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(userService).toBeDefined()
  })

  describe('users service', () => {
    it('should return "Hello World!"', () => {
      expect(userService.getHello()).toBe('Hello World!')
    })
  })
})
