import { styled } from '../../theme'

export const BannerContentWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row'
})

export const BannerContent = styled('div', {
  display: 'flex',
  flex: 1,
  alignItems: 'center'
})

export const BannerContentIcon = styled('div', {
  display: 'flex',
  marginRight: '$xs',
  fontSize: '$subheadline'
})

export const BannerContentBody = styled('div', {
  display: 'flex',
  flex: 1,
  flexDirection: 'column'
})

export const BannerContentAction = styled('div', {
  display: 'flex',
  marginTop: '$2xs * -1'
})

export const BannerContentClose = styled('a', {
  fontSize: '$footnote',
  lineHeight: '$fontSizes$footnote',
  display: 'flex',
  alignItems: 'center'
})

export const BannerDescription = styled('div', {
  fontSize: '$callout',
  lineHeight: '$lg'
})

export const BannerTitle = styled('div', {
  marginBottom: '$3xs',
  fontSize: '$body',
  fontWeight: '500',
  lineHeight: '$2xl'
})

export const BannerBase = styled('div', {
  // Reset
  boxSizing: 'border-box',
  padding: '10px 12px',
  color: '$color-type-primary',
  border: '1px solid',
  borderRadius: '$space$3xs',

  '&::before': {
    boxSizing: 'border-box'
  },
  '&::after': {
    boxSizing: 'border-box'
  },

  variants: {
    size: {
      sm: {
        [`& ${BannerContentIcon}`]: {},
        [`& ${BannerDescription}`]: {
          fontWeight: 500
        }
      },
      lg: {
        [`& ${BannerContentIcon}`]: {
          fontSize: '$title4',
          marginRight: '$md'
        },
        [`& ${BannerDescription}`]: {
          // TODO: lacks token
          fontWeight: 400,
          lineHeight: '22px'
        }
      }
    },
    variant: {
      info: {
        backgroundColor: '$color-status-info-bg',
        borderColor: '$color-hue-blue-hover',
        color: '$color-primary-default',
        [`& ${BannerContentClose}`]: {
          color: '$color-primary-default'
        }
      },
      error: {
        backgroundColor: '$color-error-bg',
        borderColor: '$color-error-border',
        color: '$color-error-default',
        [`& ${BannerContentClose}`]: {
          color: '$color-error-default'
        }
      },
      warning: {
        backgroundColor: '$color-status-warning-bg',
        borderColor: '$color-hue-yellow-pressed'
      },
      success: {
        backgroundColor: '$color-hue-green-bg',
        borderColor: '$color-hue-green-pressed',
        color: '$color-hue-green-dafault',
        [`& ${BannerContentClose}`]: {
          color: '$color-hue-green-dafault'
        }
      }
    },
    full: {}
  },
  compoundVariants: [
    {
      variant: 'warning',
      css: {
        [`& ${BannerContentIcon}`]: {
          color: '$color-hue-orange-default'
        },
        [`& ${BannerContentClose}`]: {
          color: '$color-hue-orange-default'
        }
      }
    }
  ],
  defaultVariants: {
    size: 'sm',
    variant: 'success'
  }
})
