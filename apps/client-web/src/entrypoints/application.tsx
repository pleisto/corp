import { createRoot } from 'react-dom/client'
import { BrickdocPWA } from '@/core/App'
import { initialization } from '@/core/initializers'

initialization()
createRoot(document.getElementById('app-entrypoint')!).render(<BrickdocPWA />)
