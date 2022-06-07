import { BlockState, ThinUser } from '../../BrickdocModels'
import { event } from '../event'

export const loadDocHistory = event<string>()('loadDocHistory', (docId: string) => {
  return { id: docId }
})

export const docHistoryReceived = event<{
  docId: string
  histories: { [key: string]: BlockState }
  users: { [key: number]: ThinUser }
}>()('docHistoryReceived', ({ docId }) => {
  return { id: docId }
})
