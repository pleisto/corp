import { type TNode } from '../constants'
import { joinNodeIdsByPath } from '../helpers'

describe('joinNodeIdsByPath', () => {
  const tree: TNode[] = [
    { key: 'a', value: 'a', title: 'a' },
    {
      key: 'b',
      value: 'b',
      title: 'b',
      children: [
        { key: 'b.1', value: 'b.1', title: 'b.1' },
        { key: 'b.2', value: 'b.2', title: 'b.2' }
      ]
    }
  ]
  describe('for top-level nodes', () => {
    it(`should add a top-level node id to an empty list`, () => {
      const list = joinNodeIdsByPath(tree, 'a', [])
      expect(list).toEqual(['a'])
    })
    it(`should add a top-level node id to an undefined list`, () => {
      const list = joinNodeIdsByPath(tree, 'a')
      expect(list).toEqual(['a'])
    })
    it(`should return the same list if the id is already included`, () => {
      const list = ['a']
      const newList = joinNodeIdsByPath(tree, 'a', list)
      expect(newList).toBe(list)
    })
  })

  describe('for nested nodes', () => {
    it(`should add the id to the list along with all its parent ids`, () => {
      const list = joinNodeIdsByPath(tree, 'b.1')
      expect(list).toEqual(['b', 'b.1'])
    })
    it(`should add only the missing ids to the list of the node's path`, () => {
      const list = ['b', 'b.1']
      const newList = joinNodeIdsByPath(tree, 'b.2', list)
      expect(newList).toEqual(['b', 'b.1', 'b.2'])
    })
    it(`should return the same list if the id is already included`, () => {
      const list = ['a', 'b', 'b.1']
      const newList = joinNodeIdsByPath(tree, 'b.1', list)
      expect(newList).toBe(list)
    })
  })
})
