import React, { useEffect } from 'react'
import { DocMetaProps } from '@/docs/pages/DocumentContentPage'
import { Button } from '@brickdoc/design-system'
import styles from './index.module.less'
import classNames from 'classnames'

declare global {
  const $: any
  const ZammadChat: any
}

export const Feedback: React.FC<DocMetaProps> = ({ docMeta: { webid } }) => {
  // TODO add feedback
  // if (!featureFlags.includes('feedback')) return <></>
  const [showChat, setShowChat] = React.useState(false)

  const zendeskSrc = 'https://static.zdassets.com/ekr/snippet.js?key=fb32e9ef-e7c2-4e33-819b-96f3e8ade368'

  const onClick = (): void => {
    setShowChat(true)
  }

  useEffect(() => {
    if (showChat) {
      const script = document.createElement('script')
      script.id = 'ze-snippet'
      script.src = zendeskSrc
      document.body.appendChild(script)
    }
  }, [showChat])

  return (
    <Button
      className={classNames([styles.feedbackBtn, 'brd-btn-text'])}
      id="feedback-form"
      type="text"
      onClick={onClick}>
      Feedback
    </Button>
  )
}
