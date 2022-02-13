import { useCallback, useEffect } from 'react'
import { useDynamicList } from '../../hooks'

export const useList = <T>(initialList: T[] = []) => {
  const {
    list,
    insert,
    merge,
    replace,
    remove,
    getKey,
    getIndex,
    move,
    push,
    pop,
    unshift,
    shift,
    sortList,
    resetList
  } = useDynamicList(initialList)

  const addList = useCallback(
    (data: T[]) => {
      const { length } = list
      merge(length ? length - 1 : length, data)
    },
    [merge, list]
  )

  useEffect(() => {
    if (initialList.length) {
      addList(initialList)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialList])

  return {
    list,
    addList,
    insert,
    merge,
    replace,
    remove,
    getKey,
    getIndex,
    move,
    push,
    pop,
    unshift,
    shift,
    sortList,
    resetList
  }
}
