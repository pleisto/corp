/* eslint-disable import/no-default-export */
import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    RubyPlugin(),
    react({
      babel: {
        parserOpts: {
          plugins: ['decorators-legacy']
        }
      }
    })
  ]
})
