import React from 'react'
import { SpaceSelect } from '@/docs/common/components/SpaceSelect'
import { TrashButton } from '@/docs/common/components/TrashButton'
import { NewPage } from '@/docs/pages/components/NewPage'
import { PageTree } from '@/docs/common/components/PageTree'
import Logo from '@/common/assets/logo_brickdoc_without_name.svg'

interface IContentSidebar {
  docMeta: { domain: string; loginDomain: string; host: string }
}

export const ContentSidebar: React.FC<IContentSidebar> = ({ docMeta }) => {
  return (
    <div className="mainActions">
      <header>
        <img className="brk-logo" src={Logo} alt="Brickdoc" />
        <SpaceSelect docMeta={docMeta} />
      </header>
      <nav>
        <div style={{ height: 112 }} />
        <PageTree docMeta={docMeta} />
        <div style={{ height: 47 }} />
      </nav>
      <footer>
        <NewPage docMeta={docMeta} />
        <TrashButton docMeta={docMeta} />
      </footer>
    </div>
  )
}
