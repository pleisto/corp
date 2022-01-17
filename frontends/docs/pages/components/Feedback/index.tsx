import React, { useContext, useEffect } from 'react'
import { DocMetaProps } from '@/docs/pages/DocumentContentPage'
import { Button } from '@brickdoc/design-system'
import styles from './index.module.less'
import classNames from 'classnames'
import { BrickdocContext } from '@/common/brickdocContext'

declare global {
  const $: any
}

export const Feedback: React.FC<DocMetaProps> = ({ docMeta: { featureFlags, webid } }) => {
  // TODO add feedback
  // if (!featureFlags.includes('feedback')) return <></>

  const jquerySrc = 'https://code.jquery.com/jquery-3.6.0.min.js'
  const { zammadFormSrc } = useContext(BrickdocContext)

  // const zammadFormSrc = 'http://10.1.21.13:8080/assets/form/form.js'

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
    }

    document.body.appendChild(script)
  }, [zammadFormSrc])

  return (
    <Button className={classNames([styles.feedbackBtn, 'brd-btn-text'])} id="feedback-form" type="text">
      Feedback
    </Button>
  )
}
