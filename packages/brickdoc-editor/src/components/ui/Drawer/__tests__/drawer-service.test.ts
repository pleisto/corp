/* eslint-disable max-nested-callbacks */
import { act, renderHook, RenderHookResult } from '@testing-library/react-hooks'
import { useDrawer, useDrawerService } from '..'
import { UseDrawerReturn } from '../drawer-service'
import { DrawerView, useDrawerStore } from '../drawer-service/store'

describe('useDrawerService', () => {
  it('should attach the service when called and detach when unmounted', () => {
    const { unmount } = renderHook(() => useDrawerService())
    const { result, rerender: rerenderStore } = renderHook(() => useDrawerStore(store => store.isAttached))
    expect(result.current).toBe(true)
    unmount()
    rerenderStore()
    expect(result.current).toBe(false)
  })
})

describe('useDrawer', () => {
  describe('for a given drawer view', () => {
    const view: DrawerView = 'explorerMenu'
    let renderedHook: RenderHookResult<unknown, UseDrawerReturn>
    beforeEach(() => {
      renderedHook = renderHook(() => useDrawer(view))
    })
    it('should be invisible when a drawer is initially invoked', () => {
      const { result } = renderedHook
      expect(result.current.visible).toBe(false)
    })

    it('should be visible when `open` is called and invisible again when `close` is called', () => {
      const { result, rerender } = renderedHook
      act(() => result.current.open())
      rerender()
      expect(result.current.visible).toBe(true)
      act(() => result.current.close())
      rerender()
      expect(result.current.visible).toBe(false)
    })

    it('should set visible by `setVisible()`', () => {
      const { result, rerender } = renderedHook
      act(() => result.current.setVisible(true))
      rerender()
      expect(result.current.visible).toBe(true)
      act(() => result.current.setVisible(false))
      rerender()
      expect(result.current.visible).toBe(false)
    })
  })
})
