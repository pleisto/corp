import create from 'zustand'
import {
  BrickdocEventBus,
  DiscussionListToggle,
  DiscussionMarkActive,
  EventSubscribed,
  ExplorerMenuTrigger
} from '@brickdoc/schema'

export type DrawerView = 'explorerMenu' | 'discussionList'
export type DrawerState = 'closed' | DrawerView

interface DrawerStore {
  isAttached: boolean
  state: DrawerState
  attach: () => Disposal
  open: (view: DrawerView) => void
  close: () => void
}

type Disposal = () => void

/** Creates the store that manages the global drawer states */
export const useDrawerStore = create<DrawerStore>((set, get) => ({
  isAttached: false,
  state: 'closed',
  attach(): Disposal {
    const subscriptions: EventSubscribed[] = [
      BrickdocEventBus.subscribe(ExplorerMenuTrigger, ({ payload }) => {
        const { open, close } = get()
        payload.visible ? open('explorerMenu') : close()
      }),
      BrickdocEventBus.subscribe(DiscussionListToggle, ({ payload }) => {
        const { state: view, open, close } = get()
        const isDiscussionOpen = view === 'discussionList'
        payload.visible ?? !isDiscussionOpen ? open('discussionList') : close()
      }),
      BrickdocEventBus.subscribe(DiscussionMarkActive, event => {
        const { open } = get()
        open('discussionList')
      })
    ]
    set({ isAttached: true })
    return () => {
      subscriptions.forEach(sub => sub.unsubscribe())
      set({ isAttached: false })
    }
  },
  open(view: DrawerView) {
    set({ state: view })
  },
  close() {
    set({ state: 'closed' })
  }
}))
