import { Test, TestingModule } from '@nestjs/testing'
import { ViteDevServer } from 'vite'
import { WebAppModule } from '../web-app.module'
import { VITE_DEV_SERVER } from '../web-app.constants'

describe('WebAppModule', () => {
  let viteServer: ViteDevServer
  let moduleRef: TestingModule

  beforeAll(async () => {
    globalThis.__enableViteDevServer__ = true
    moduleRef = await Test.createTestingModule({
      imports: [WebAppModule]
    }).compile()
    viteServer = moduleRef.get<ViteDevServer>(VITE_DEV_SERVER)
  })

  afterAll(async () => {
    globalThis.__enableViteDevServer__ = false
    await moduleRef.close()
  })

  it('should export VITE_DEV_SERVER', async () => {
    expect(viteServer).toBeTruthy()
  })
})
