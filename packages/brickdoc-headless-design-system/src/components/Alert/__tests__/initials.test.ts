import { name2Initials } from '../../Avatar/initials'

describe('Avatar intials', () => {
  it.each([
    // single initial
    { name: 'abc', expected: 'A' },
    { name: 'ABC', expected: 'A' },
    { name: '123', expected: '1' },
    { name: '赵钱孙李', expected: '赵' },
    { name: ' John', expected: 'J' }, // leading space
    { name: 'John ', expected: 'J' }, // trailing space
    { name: ' John ', expected: 'J' }, // wrapping space
    // two or more initials
    { name: 'John Smith', expected: 'JS' },
    { name: 'John Doe Smith', expected: 'JS' },
    { name: '1 2', expected: '12' },
    { name: '赵 钱', expected: '赵钱' }
  ])('should have $expected as the initials of $name', ({ name, expected }) => {
    expect(name2Initials(name)).toBe(expected)
  })
})
