import { BrickdocEventBus, DiscussionListToggle } from '@brickdoc/schema'
import { itemStyle } from '@/docs/pages/components/DocumentTopBar/DocumentTopBar.style'
import { Button, Icon } from '@brickdoc/design-system'
import { useCallback } from 'react'
import { useDocsI18n } from '../../hooks'

export interface DiscussionMenuProps {
  className?: string
}

export const TopbarMore: React.FC<DiscussionMenuProps> = ({ className }) => {
  const { t } = useDocsI18n()

  const onClick = useCallback(() => {
    BrickdocEventBus.dispatch(DiscussionListToggle({}))
  }, [])

  return (
    <Button className={className} type="text" onClick={onClick} css={itemStyle}>
      <Icon.More aria-label={t('more.tooltip')} />
    </Button>
  )
}
