import React, { useEffect } from 'react'
import { DocMetaProps } from '@/docs/pages/DocumentContentPage'
import { Button } from '@brickdoc/design-system'
import { TEST_ID_ENUM } from '@brickdoc/test-helper'
import { sidebarButtonStyles } from '../../DocumentContentPage.style'

export const Feedback: React.FC<DocMetaProps> = ({ docMeta }) => {
  // if (!featureFlags.includes('feedback')) return <></>
  const [showChat, setShowChat] = React.useState(false)

  const onClick = (): void => {
    setShowChat(true)
  }

  useEffect(() => {
    if (showChat) {
      const script = document.createElement('script')
      script.innerHTML = `
  window.intercomSettings = {
    api_base: "https://api-iam.intercom.io",
    app_id: "cl0lf7xa",
    name: "${docMeta.domain}", // Full name
    email: "${docMeta.domain}", // Email address
    created_at: "1646128924" // Signup date as a Unix timestamp
  };
  `
      document.body.appendChild(script)

      const script2 = document.createElement('script')
      script2.innerHTML = `
      (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/cl0lf7xa';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
      `
      document.body.appendChild(script2)
    }
  }, [docMeta.domain, showChat])

  return (
    <Button
      data-testid={TEST_ID_ENUM.page.DocumentPage.feedbackButton.id}
      type="text"
      css={sidebarButtonStyles}
      onClick={onClick}>
      Feedback
    </Button>
  )
}
