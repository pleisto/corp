import { cable } from '@/common/apollo'

// I18n
// eslint-disable-next-line import/first
import '@/common/i18next'
globalThis.brickdocContext = globalThis.brickdocContext || {}
globalThis.brickdocContext.wsCable = cable
globalThis.brickdocContext.timezone ||= Intl?.DateTimeFormat().resolvedOptions().timeZone || globalThis.brickdocContext.defaultTimezone

// Self-XSS Attack Warning
if (globalThis.brickdocContext.env !== 'development') {
  console.log(
    '\n\n%cUsing this console may allow attackers to impersonate you and steal your information using an attack called Self-XSS. Do not enter or paste code that you do not understand.',
    'font-weight: bold;color:#dc3545;font-size:18px;'
  )
}
var x=2
