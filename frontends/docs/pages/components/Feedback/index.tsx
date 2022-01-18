import React, { useContext, useEffect } from 'react'
import { DocMetaProps } from '@/docs/pages/DocumentContentPage'
import { Button } from '@brickdoc/design-system'
import styles from './index.module.less'
import classNames from 'classnames'
import { BrickdocContext } from '@/common/brickdocContext'

declare global {
  const $: any
  const ZammadChat: any
}

export const Feedback: React.FC<DocMetaProps> = ({ docMeta: { featureFlags, webid } }) => {
  // TODO add feedback
  // if (!featureFlags.includes('feedback')) return <></>
  const [showChat, setShowChat] = React.useState(false)

  const jquerySrc = 'https://code.jquery.com/jquery-3.6.0.min.js'
  const { zammadFormSrc, zammadChatSrc } = useContext(BrickdocContext)

  // const zammadFormSrc = 'http://10.1.21.13/assets/form/form.js'
  // const zammadChatSrc = 'http://10.1.21.13/assets/chat/chat.js'

  const onClick = (): void => {
    setShowChat(true)
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const script = document.createElement('script')
    script.src = jquerySrc
    script.onload = () => {
      const script = document.createElement('script')
      script.id = 'zammad_form_script'
      script.async = true
      script.onload = () => {
        $('#feedback-form').ZammadForm({
          messageTitle: 'Feedback Form',
          messageSubmit: 'Submit',
          messageThankYou: "Thank you for your inquiry (#%s)! We'll contact you as soon as possible.",
          debug: true,
          modal: true,
          attachmentSupport: true,
          attributes: [
            {
              display: 'Name',
              name: 'name',
              tag: 'input',
              type: 'text',
              placeholder: 'Your Name',
              defaultValue: ''
            },
            {
              display: 'Email',
              name: 'email',
              tag: 'input',
              type: 'email',
              required: true,
              placeholder: 'Your Email',
              defaultValue() {
                return '123@brickdoc.com'
              }
            },
            {
              display: 'Message',
              name: 'body',
              tag: 'textarea',
              required: true,
              placeholder: 'Your Message...',
              defaultValue: '',
              rows: 7
            },
            {
              display: 'Attachments',
              name: 'file[]',
              tag: 'input',
              type: 'file',
              repeat: 3
            }
          ]
        })
      }
      script.src = zammadFormSrc
      document.body.appendChild(script)

      const script2 = document.createElement('script')
      script2.id = 'zammad_chat_script'
      script2.async = true
      script2.src = zammadChatSrc
      script2.onload = () => {
        // eslint-disable-next-line no-new
        new ZammadChat({
          show: showChat,
          fontSize: '12px',
          chatId: 1
        })
      }
      document.body.appendChild(script2)
    }

    document.body.appendChild(script)
  }, [zammadFormSrc, zammadChatSrc, showChat])

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
