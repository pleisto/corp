import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/inertia-react'
import { InertiaProgress } from '@inertiajs/progress'
import { i18nextInit } from '@brickdoc/client-web/src/core/initializers/i18next'
import * as views from '../views'

i18nextInit()

// Handle error when views are not found
const RouteError = (name: string) => () => <pre>Error: Inertia Route '{name}' Not Found</pre>

void createInertiaApp({
  resolve: (name: string) => (views as any)[name] || RouteError(name),
  setup({ el, App, props }) {
    const root = createRoot(el)
    root.render(<App {...props} />)
  }
})

InertiaProgress.init()
