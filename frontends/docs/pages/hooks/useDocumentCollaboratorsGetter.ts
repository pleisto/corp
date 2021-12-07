import React from 'react'
import { DocMeta } from '../DocumentContentPage'

export function useDocumentCollaboratorsGetter(docMeta: DocMeta): Function[] {
  const data = docMeta.collaborators
  const collaborators = React.useRef(data)
  React.useEffect(() => {
    collaborators.current = data
  }, [data])

  return [() => collaborators.current.map(user => ({ name: user.name, webid: user.webid, avatar: user.avatarData?.url ?? undefined }))]
}
