import { checkValidName } from '../util'

const validNames: Array<{ name: string; todo?: string }> = [
  { name: 'a213' },
  { name: '_a' },
  { name: 'num0' },
  { name: 'a_' },
  { name: 'a测试' },
  { name: 'aOrder' },
  { name: 'Order' },
  { name: '_or' },
  { name: 'true你好', todo: 'fix unicode regex \b' },
  { name: 'atrue1' },
  { name: '_atrue1' },
  { name: 'true1' }
]
const invalidNames: Array<{ name: string }> = [
  { name: '123' },
  { name: '1a' },
  { name: 'a+1' },
  { name: 'a;a' },
  { name: ' aa' },
  { name: 'a ' },
  { name: '' },
  { name: '测试' },

  // Blank
  { name: 'a a' },
  { name: 'a\na' },
  { name: 'a\u2003a' },

  // Special char
  { name: 'a!' },
  { name: 'a@' },
  { name: 'a#' },
  { name: 'a$' },
  { name: 'a%' },
  { name: 'a^' },
  { name: 'a&' },
  { name: 'a*' },
  { name: 'a(' },
  { name: 'a)' },
  { name: 'a-' },
  { name: 'a[' },
  { name: 'a]' },
  { name: 'a{' },
  { name: 'a}' },
  { name: 'a\\' },
  { name: 'a|' },
  { name: 'a:' },
  { name: 'a"' },
  { name: "a'" },
  { name: 'a<' },
  { name: 'a>' },
  { name: 'a?' },
  { name: 'a/' },
  { name: 'a.' },
  { name: 'a,' },
  { name: 'a;' },
  { name: 'a`' },
  { name: 'a~' },
  { name: 'a=' },
  { name: 'a+' }
]

describe('name', () => {
  it.each(validNames)('valid: "$name"', ({ name, todo }) => {
    if (todo) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(checkValidName(name)).toMatchSnapshot()
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(checkValidName(name)).toBe(true)
    }
  })

  it.each(invalidNames)('invalid: "$name"', ({ name }) => {
    expect(checkValidName(name)).toBe(false)
  })
})
