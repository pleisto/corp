import create from 'zustand'
import {
  BrickdocEventBus,
  DiscussionListToggle,
  DiscussionMarkActive,
  EventSubscribed,
  ExplorerMenuTrigger
} from '@brickdoc/schema'

export enum DrawerView {
  Closed,
  ExplorerMenu,
  DiscussionList
}

interface DrawerService {
  view: DrawerView
  attach: () => Disposal
  open: (view: DrawerView) => void
  close: () => void
}

type Disposal = () => void

export const useDrawerService = create<DrawerService>((set, get) => ({
  view: DrawerView.Closed,
  attach(): Disposal {
    const subscriptions: EventSubscribed[] = [
      BrickdocEventBus.subscribe(ExplorerMenuTrigger, ({ payload }) => {
        get().open(payload.visible ? DrawerView.ExplorerMenu : DrawerView.Closed)
      }),
      BrickdocEventBus.subscribe(DiscussionListToggle, ({ payload }) => {
        const { view, open } = get()
        const isDiscussionOpen = view === DrawerView.DiscussionList
        open(payload.visible ?? !isDiscussionOpen ? DrawerView.DiscussionList : DrawerView.Closed)
      }),
      BrickdocEventBus.subscribe(DiscussionMarkActive, event => {
        const { view, close } = get()
        if (view !== DrawerView.DiscussionList) {
          close()
        }
      })
    ]
    return () => subscriptions.forEach(sub => sub.unsubscribe())
  },
  open(view: DrawerView) {
    set({ view })
  },
  close() {
    set({ view: DrawerView.Closed })
  }
}))
