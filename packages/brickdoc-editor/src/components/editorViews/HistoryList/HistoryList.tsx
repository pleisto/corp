import React from 'react'
// import { Icon, Menu } from '@brickdoc/design-system'
// import { Editor } from '@tiptap/core'
// import { BlockState } from '@brickdoc/schema'
import { InnerMenuContainer, InnerMenu, MenuItem, HistoryTime, Username } from './styles'
import { Drawer } from '../../ui'
import { useDrawer } from '../../ui/Drawer'
import { useEditorI18n } from '../../../hooks'
import { useNavigate } from 'react-router-dom'

import { useDocHistoryStore } from '@brickdoc/schema'

export interface HistoryListProps {
  domain: string
  docId: string
  historyId?: string
}

export const HistoryList: React.FC<HistoryListProps> = ({ domain, docId, historyId }) => {
  const [t] = useEditorI18n()
  const navigate = useNavigate()
  const { visible, setVisible } = useDrawer('historyList')
  const latestVisiable = React.useRef<boolean>(visible)

  const { store, refetch } = useDocHistoryStore(docId)

  React.useEffect(() => {
    if (visible && (!latestVisiable.current || !store.loaded)) {
      // refetch on list reopen
      refetch()
    }
    latestVisiable.current = visible
  }, [visible, refetch, store.loaded])

  const historiesSorted = Object.values(store.histories).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <Drawer
      container={document.getElementById('aside') as HTMLElement}
      visible={visible}
      onClose={() => setVisible(false)}
      title={t('history.title')}
      renderBody={() => (
        <>
          <InnerMenuContainer>
            <InnerMenu type="ghost">
              {historiesSorted.map((history, i) => (
                <MenuItem
                  key={i}
                  itemKey={history.id}
                  active={historyId ? historyId === history.id : i === 0}
                  onClick={() =>
                    i === 0 ? navigate(`/${domain}/${docId}`) : navigate(`/${domain}/${docId}/histories/${history.id}`)
                  }
                >
                  <div>
                    <HistoryTime>{history.createdAt}</HistoryTime>
                    <Username>{history.username}</Username>
                  </div>
                </MenuItem>
              ))}
            </InnerMenu>
          </InnerMenuContainer>
        </>
      )}
    />
  )
}
