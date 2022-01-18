export {}

const utils: Record<string | symbol, unknown> = jest.createMockFromModule('@react-aria/utils')
utils.useId = jest.fn().mockImplementation(defaultValue => defaultValue || 'mock-component-id')
module.exports = utils
