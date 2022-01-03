import { theme, styled } from '../../../themes'

export const TagRoot = styled('div', {
  display: 'flex',
  include: ['flexCenter'],
  padding: '4px 12px',
  background: theme.colors.backgroundPrimary,
  border: `1px solid ${theme.colors.borderPrimary}`,
  borderRadius: 20,
  color: theme.colors.typePrimary,
  cursor: 'pointer',

  variants: {
    size: {
      sm: {
        fontSize: theme.fontSizes.callout,
        lineHeight: theme.lineHeights.callout
      },
      md: {
        fontSize: theme.fontSizes.callout,
        lineHeight: theme.lineHeights.callout
      },
      lg: {
        fontSize: theme.fontSizes.body,
        lineHeight: theme.lineHeights.body
      }
    },
    border: {
      true: {
        border: `1px solid ${theme.colors.borderPrimary}`
      },
      false: {
        border: 'none'
      }
    },
    color: {
      none: {
        background: 'transparent',
        borderColor: 'transparent',
        '&:hover': {
          background: 'transparent'
        }
      },
      primary: {
        borderColor: theme.colors.borderPrimary,
        '&:hover': {
          background: theme.colors.backgroundSecondary,
          borderColor: theme.colors.borderPrimary
        }
      },
      red: {
        background: theme.colors.red1,
        borderColor: theme.colors.red2,
        color: theme.colors.red7,
        '&:hover': {
          background: theme.colors.red2,
          borderColor: theme.colors.red3
        }
      }
    },

    pressed: {
      true: {
        background: theme.colors.thirdaryPressed,
        borderColor: theme.colors.borderSecondary,
        '&:hover': {
          background: theme.colors.thirdaryPressed,
          borderColor: theme.colors.borderSecondary
        }
      }
    }
  },

  compoundVariants: [
    {
      color: 'red',
      pressed: true,
      css: {
        background: theme.colors.red3,
        borderColor: theme.colors.red3,
        '&:hover': {
          background: theme.colors.red3,
          borderColor: theme.colors.red3
        }
      }
    }
  ]
})
