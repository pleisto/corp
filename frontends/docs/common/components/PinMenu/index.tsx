import { useBlockPinOrUnpinMutation } from '@/BrickdocGraphQL'
import { NonNullDocMeta } from '@/docs/pages/DocumentContentPage'
import { queryBlockInfo } from '@/docs/pages/graphql'
import { Pin, Unpin } from '@brickdoc/design-icons'
import { Button, Tooltip } from '@brickdoc/design-system'
import React from 'react'
import { queryBlockPins } from '../../graphql'
import { useDocsI18n } from '../../hooks'
interface PinMenuProps {
  docMeta: NonNullDocMeta
  className: string
}

export const PinMenu: React.FC<PinMenuProps> = ({ docMeta, className }) => {
  const [blockPinOrUnpin, { loading: blockPinOrUnpinLoading }] = useBlockPinOrUnpinMutation({
    refetchQueries: [queryBlockInfo, queryBlockPins]
  })
  const { t } = useDocsI18n()

  const onClick = async (): Promise<void> => {
    const input = { blockId: docMeta.id, pin: !docMeta.pin }
    await blockPinOrUnpin({ variables: { input } })
  }

  // TODO: 这里切换pin状态后会抖动，估计export svg时候姿势不对
  return (
    <>
      <Tooltip title={t(docMeta.pin ? 'pin.remove_tooltip' : 'pin.add_tooltip')}>
        <Button className={className} type="text" onClick={onClick} disabled={blockPinOrUnpinLoading} loading={blockPinOrUnpinLoading}>
          {docMeta.pin ? <Pin size={20} /> : <Unpin size={20} />}
        </Button>
      </Tooltip>
    </>
  )
}
