import { getRecentItemKey, addItemKey } from '../recentItemsManager'

describe('recentItemsManager', () => {
  it('works correctly', () => {
    const key = 'key'

    addItemKey(key)
    addItemKey(key)

    const keys = getRecentItemKey()

    expect(keys).toHaveLength(1)
    expect(keys[0]).toEqual(key)
  })
})
