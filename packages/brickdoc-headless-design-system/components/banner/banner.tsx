import { FC, useCallback, useState } from 'react'
import { Success, Info, Caution, CloseOne, Close } from '@brickdoc/design-icons'

import {
  BannerBase,
  BannerContentWrapper,
  BannerContent,
  BannerContentIcon,
  BannerContentBody,
  BannerContentClose,
  BannerContentAction,
  BannerTitle,
  BannerDescription
} from './style'

export type Type = 'info' | 'error' | 'warning' | 'success'

export interface BannerProps {
  type?: Type
  className?: string
  fullMode?: boolean
  title?: React.ReactNode
  message?: React.ReactNode
  closeIcon?: boolean
  icon?: boolean
  onClose?: (e: React.MouseEvent) => void
  action?: React.ReactNode
}

export interface BannerState {
  visible: boolean
}

const Banner: FC<BannerProps> = props => {
  const { action, type = 'success', className, closeIcon = true, icon = true, title, message, onClose } = props
  const [visible, setVisible] = useState<boolean>(true)

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      setVisible(false)
      onClose?.(e)
    },
    [setVisible, onClose]
  )

  const size = title ? 'lg' : 'sm'

  const titleDom = title ? <BannerTitle>{title}</BannerTitle> : null

  const iconMap = {
    warning: <Caution />,
    success: <Success />,
    info: <Info />,
    error: <CloseOne />
  }

  const iconDom = icon ? <BannerContentIcon>{iconMap[type]}</BannerContentIcon> : null

  const actionDom = action ? <BannerContentAction>{action}</BannerContentAction> : null

  const closeDom =
    closeIcon && !title && !action ? (
      <BannerContentClose onClick={handleClose}>
        <Close />
      </BannerContentClose>
    ) : null

  const alertDom = visible ? (
    <BannerBase className={className} size={size} variant={type}>
      <BannerContentWrapper>
        <BannerContent>
          {iconDom}
          <BannerContentBody>
            {titleDom}
            <BannerDescription>{message}</BannerDescription>
          </BannerContentBody>
          {actionDom}
          {closeDom}
        </BannerContent>
      </BannerContentWrapper>
    </BannerBase>
  ) : (
    <></>
  )

  return alertDom
}

export default Banner
