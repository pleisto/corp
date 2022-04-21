import bg from '@/common/assets/ceramicBg.webp'
import { theme, styled } from '@brickdoc/design-system'

export const Section = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  padding: '0.1px 0 0 0.5rem',
  marginTop: '-0.1px',
  justifyContent: 'space-between',
  minWidth: 270,
  maxWidth: 496
})

export const Layout = styled('div', {
  display: 'flex',
  flex: 'auto',
  flexDirection: 'row',
  minHeight: '100vh',
  background: `url(${bg}) no-repeat center center fixed`,
  backgroundSize: 'cover, cover',
  backgroundClip: 'border-box',
  '.w-split': {
    height: '100%',
    width: '100%'
  },
  '.w-split-horizontal': {
    '.w-split-bar': {
      width: '0.5rem',
      background: 'transparent',
      boxShadow: 'none',
      '&:hover': {
        background: theme.colors.overlaySecondary
      },
      '&::after, &::before': {
        display: 'none'
      }
    }
  },
  [`${Section}`]: {
    '.mainActions header > .brk-logo': {
      height: '24px',
      margin: '1rem 18px'
    },
    '& > footer': {
      display: 'flex',
      alignItems: 'center'
    },
    '.mainActions nav': {
      overflow: 'hidden'
    }
  },
  '& main.content': {
    display: 'flex',
    flexDirection: 'column',
    flex: 'auto',
    height: '100vh',
    '& > header': {
      height: '3.5rem',
      padding: '0 3.5rem 0 0',
      lineHeight: '3.5rem'
    },
    '& > section': {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gridAutoRows: 'minmax(min-content, 100%)',
      overflowY: 'auto',
      height: '100vh',

      '& > article': {
        include: ['ceramicSecondary'],
        display: 'flex',
        minHeight: '0',
        '--brd-editor-max-width': '960px',
        borderRadius: '2px'
      },
      '& > aside': {
        minWidth: '3rem'
      }
    }
  },

  variants: {
    width: {
      md: {
        [`${Section}`]: {
          display: 'none'
        },
        '.w-split-bar': {
          display: 'none'
        },
        '& main.content': {
          flex: 1,
          '& > header': {
            background: theme.colors.ceramicSecondary
          },
          '& > section': {
            '& > article': {
              background: theme.colors.ceramicSecondary,
              boxShadow: 'unset'
            },
            '& > aside': {
              minWidth: '0rem'
            }
          }
        }
      },
      sm: {
        [`${Section}`]: {
          display: 'none'
        },
        '& main.content': {
          flex: 1,
          '& > header': {
            background: theme.colors.backgroundSecondary
          },
          '& > section': {
            '& > article': {
              background: theme.colors.backgroundSecondary,
              boxShadow: 'unset'
            },
            '& > aside': {
              minWidth: '0rem'
            }
          }
        }
      }
    }
  }
})

export const sidebarButtonStyles = {
  color: theme.colors.typeSecondary,
  display: 'flex',
  fontSize: theme.fontSizes.subHeadline,
  justifyContent: 'flex-start',
  flex: 1,
  padding: '0.75rem'
}
