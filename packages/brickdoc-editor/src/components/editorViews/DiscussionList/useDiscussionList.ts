import { useEffect, Dispatch, SetStateAction, useRef, useCallback } from 'react'
import { selectDiscussionMark } from '../../../helpers/discussion'
import { CommentedNode } from './useCommentedNodes'
import { useExternalProps } from '../../../hooks/useExternalProps'
import { useDrawerService, DrawerView } from '../../../services/DrawerService'

interface UseDiscussionListReturn {
  visible: boolean
  toggle: (visible: boolean) => void
}

export function useDiscussionList(
  commentedNodes: CommentedNode[],
  setActiveMarkId: Dispatch<SetStateAction<string | null>>
): UseDiscussionListReturn {
  const { pageQuery } = useExternalProps()
  const latestPageQuery = useRef<URLSearchParams | null>()

  const visible = useDrawerService(service => service.view) === DrawerView.DiscussionList
  const close = useDrawerService(service => service.close)
  const open = useDrawerService(service => service.open)

  const toggle = useCallback(
    (visible: boolean) => {
      visible ? open(DrawerView.DiscussionList) : close()
    },
    [close, open]
  )

  // open discussion list when open an url with comment info
  useEffect(() => {
    const markId = pageQuery?.get('discussionMarkId')
    if (latestPageQuery.current?.get('discussionMarkId') === markId) return

    const commentedNode = commentedNodes.find(node => node.markId === markId)
    if (!commentedNode) return

    toggle(true)
    selectDiscussionMark(commentedNode.domNode)
    latestPageQuery.current = pageQuery

    // wait for drawer open animation
    const timer = setTimeout(() => {
      setActiveMarkId(commentedNode.markId)
    }, 200)
    return () => clearTimeout(timer)
  }, [commentedNodes, pageQuery, setActiveMarkId, toggle])

  return {
    visible,
    toggle
  }
}
