import { styled, theme, Button, css } from '@mashcard/design-system'

export const Page = styled('div', {
  background: theme.colors.white,
  boxSize: 'border-box'
})

export const ActiveBgWrapper = styled('div', {
  position: 'relative',
  '.active-bg': {
    position: 'fixed',
    bottom: 0,
    height: '100vh',
    width: '100%',
    objectFit: 'cover'
  },
  variants: {
    end: {
      true: {
        '.active-bg': {
          position: 'absolute'
        }
      }
    }
  }
})

export const SectionLogoWrapper = styled('div', {
  position: 'absolute',
  top: 40,
  left: 124,
  '@media (max-width: 950px)': {
    top: 16,
    left: 24
  }
})

export const SnsLinkWrapper = styled('div', {
  position: 'absolute',
  top: 40,
  right: 140,
  display: 'flex',
  a: {
    color: 'transparent'
  },
  '@media (max-width: 950px)': {
    top: 20,
    right: 24
  }
})

export const SnsLink = styled('a', {
  fontWeight: '450',
  lineHeight: '44px',
  marginLeft: 24,
  fontSize: '22px',
  color: theme.colors.typePrimary,
  '@media (max-width: 950px)': {
    lineHeight: '32px',
    fontSize: '16px',
    left: 24
  },
  '.brd-icon': {
    marginLeft: 4,
    fontSize: 18,
    '@media (max-width: 950px)': {
      marginLeft: 14,
      fontSize: '12px'
    }
  },
  '&:hover': {
    textDecoration: 'none',
    opacity: 0.7
  }
})

export const ContentSection = styled('div', {
  height: '100%',
  width: '100%',
  zIndex: -1,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  // backgroundColor: theme.colors.white,
  variants: {
    fullpage: {
      true: {
        height: '100vh'
      }
    }
  },
  '@media (min-width: 950px)': {
    background: 'transparent',
    backgroundImage: 'unset!important'
  }
})

export const ContentWrapper = styled('div', {
  position: 'relative',
  height: '100%',
  margin: '0 var(--extra-margin)',
  padding: '0 124px',
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
  '@media (max-width: 950px)': {
    margin: 0,
    alignItems: 'center',
    padding: '0 24px'
  }
})

export const SectionTitle = styled('div', {
  fontWeight: '700',
  fontSize: '80px',
  lineHeight: '90px',
  paddingBottom: '12px',
  '@media (max-width: 950px)': {
    fontSize: '44px',
    lineHeight: '56px'
  }
})

export const SectionComment = styled('div', {
  fontWeight: '450',
  fontSize: '32px',
  lineHeight: '47px',
  maxWidth: 592,
  width: '100%',
  color: theme.colors.typeSecondary,
  '@media (max-width: 950px)': {
    fontSize: '16px',
    lineHeight: '28px'
  },
  variants: {
    sec1commont: {
      true: {
        paddingBottom: 120,
        '@media (max-width: 950px)': {
          paddingBottom: 120
        }
      }
    },
    sec2commont: {
      true: {
        paddingBottom: 101,
        '@media (max-width: 950px)': {
          paddingBottom: 68
        }
      }
    },
    sec3commont: {
      true: {
        paddingBottom: 98,
        '@media (max-width: 950px)': {
          paddingBottom: 100
        }
      }
    }
  }
})

export const section1ContentCls = css({
  justifyContent: 'center!important',
  '@media (max-width: 950px)': {
    textAlign: 'center',
    alignItems: 'center'
  }
})()

export const JoinButton = styled(Button, {
  marginTop: 24,
  width: 392,
  height: 64,
  span: {
    fontSize: '24px'
  },
  '@media (max-width: 950px)': {
    alignSelf: 'center',
    width: 236,
    height: 40,
    span: {
      fontSize: '18px'
    }
  }
})

export const LinkList = styled('div', {
  paddingTop: 56,
  display: 'flex',
  '@media (max-width: 950px)': {
    paddingTop: 30
  }
})

export const LinkBlock = styled('a', {
  width: 75,
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none!important',
  '.icon': {
    height: 40,
    width: 40,
    borderRadius: 2,
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.4)',
    color: theme.colors.white,
    fontSize: 20
  },
  '.label': {
    background: theme.colors.backgroundOverlayQuaternary,
    fontWeight: '600',
    fontSize: '12px',
    lineHeight: '18px',
    padding: '0 4px',
    color: theme.colors.white,
    borderRadius: 2,
    marginTop: 9,
    opacity: 0
  },
  '&:hover': {
    '.icon': {
      background: theme.colors.dividerOverlayThirdary,
      color: theme.colors.white
    },
    '.label': {
      opacity: 1
    }
  }
})

export const sec3style = {
  alignItems: 'flex-end',
  textAlign: 'right'
}

export const sec4style = {
  color: theme.colors.white
}

export const Timeline = styled('div', {
  paddingTop: 88,
  margin: '0 auto',
  position: 'relative',
  '@media (max-width: 950px)': {
    paddingTop: 56
  },
  '&::before': {
    content: '',
    borderLeft: '1px dashed #ccc',
    position: 'absolute',
    top: 135,
    height: 'calc(100% - 220px)',
    '@media (max-width: 950px)': {
      top: 70
    }
  }
})

export const TimelineBlock = styled('div', {
  display: 'flex',
  position: 'relative',
  paddingBottom: 56,
  '@media (max-width: 950px)': {
    flexFlow: 'column',
    padding: '0 0 56px 25px'
  },
  img: {
    borderRadius: 16
  }
})

export const TimelineContent = styled('div', {
  width: 396,
  padding: '0 70px 0 66px',
  '@media (max-width: 950px)': {
    padding: '0 0 24px',
    width: 'unset'
  },
  '.func-icon': {
    height: 52,
    width: 52,
    borderRadius: 52,
    lineHeight: '56px',
    textAlign: 'center',
    position: 'absolute',
    left: -25,
    top: 32,
    fontSize: 24,
    background: theme.colors.iconPrimary,
    color: theme.colors.white,
    '@media (max-width: 950px)': {
      height: 24,
      width: 24,
      lineHeight: '24px',
      borderRadius: 24,
      fontSize: 14,
      left: -11,
      top: 4
    }
  },
  '.title': {
    paddingTop: 36,
    fontWeight: '600',
    fontSize: '30px',
    lineHeight: '46px',
    color: theme.colors.typeSecondary,
    '@media (max-width: 950px)': {
      paddingTop: 0,
      fontSize: '22px',
      lineHeight: '32px'
    }
  },
  'sub-title': {
    paddingTop: 8,
    fontWeight: 600,
    fontSize: '22px',
    lineHeight: '30px',
    color: theme.colors.typePrimary
  },
  '.detail': {
    fontWeight: '450',
    fontSize: '16px',
    lineHeight: '28px',
    color: theme.colors.typeSecondary
  },
  '.status-tag': {
    marginTop: 8,
    lineHeight: '24px',
    width: 'fit-content',
    borderRadius: 12,
    padding: '0 8px',
    background: theme.colors.green2,
    color: theme.colors.green8,
    fontWeight: '600',
    fontSize: '16px',

    '&.coming': {
      background: theme.colors.blue2,
      color: theme.colors.blue6
    }
  }
})

export const JoinBlock = styled('div', {
  textAlign: 'center',
  position: 'relative',
  paddingBottom: 36,
  '&::before': {
    content: '',
    display: 'block',
    borderTop: `1px solid ${theme.colors.dividerPrimary}`,
    position: 'absolute',
    top: 0,
    left: 24,
    width: 'calc(100% - 48px)'
  }
})

export const JoinPrivateTitle = styled('div', {
  padding: '35px 0 24px',
  fontSize: '32px',
  lineHeight: '44px',
  '@media (max-width: 950px)': {
    fontSize: '20px',
    lineHeight: '28px',
    paddingBottom: 12
  }
})

export const ContactBtn = styled(Button, {
  width: 155,
  height: 52,
  span: {
    fontSize: '24px'
  },
  '@media (max-width: 950px)': {
    width: 113,
    height: 40,
    span: {
      fontSize: '16px'
    }
  }
})

export const Footer = styled('footer', {
  padding: '66px 0 136px',
  display: 'flex',
  maxWidth: 892,
  width: '100%',
  margin: '0 auto',
  justifyContent: 'space-around',
  '@media (max-width: 950px)': {
    flexFlow: 'column nowrap',
    padding: '0 24px',
    flex: 1
  }
})

export const FooterBlock = styled('div', {
  width: 172,

  '@media (max-width: 950px)': {
    width: 'unset',
    paddingTop: 68
  },

  '.desc': {
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '28px',
    marginBottom: 24
  },

  '.copy': {
    fontWeight: '450',
    fontSize: '16px',
    lineHeight: '28px',
    color: theme.colors.typeSecondary
  },

  '.title': {
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '28px',
    paddingBottom: 16
  },

  '.link-list': {
    fontWeight: '450',
    paddingBottom: 36,
    display: 'flex',
    flexFlow: 'column nowrap',
    a: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      lineHeight: '34px',
      color: theme.colors.typePrimary,
      '.brd-icon': {
        fontSize: '16px',
        marginRight: 4
      },
      '.text-offset': {
        marginLeft: 4
      },
      '.bug-wrapper': {
        height: 16,
        width: 16,
        lineHeight: '16px',
        textAlign: 'center',
        background:
          'linear-gradient(0deg, rgba(248, 251, 255, 0.36), rgba(248, 251, 255, 0.36)), rgba(255, 255, 255, 0.74)',
        boxShadow:
          '1px 1px 0px rgba(255, 255, 255, 0.8), 0px 2px 4px rgba(167, 167, 167, 0.3), inset 1px 1px 0px rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(16px)',
        borderRadius: '2px'
      }
    }
  }
})
