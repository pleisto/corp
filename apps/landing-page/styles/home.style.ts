import { styled, theme, Button, css } from '@mashcard/design-system'

const max950 = '@media (max-width: 950px)'

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
  left: 60,
  width: 138,
  height: 32,
  [max950]: {
    top: 16,
    left: 24,
    width: 99,
    height: 24
  }
})

export const SnsLinkWrapper = styled('div', {
  position: 'absolute',
  top: 46,
  right: 60,
  display: 'flex',
  a: {
    color: 'transparent'
  },
  [max950]: {
    top: 18,
    right: 24
  }
})

export const SnsLink = styled('a', {
  fontWeight: '450',
  lineHeight: '44px',
  marginLeft: 24,
  fontSize: '22px',
  color: theme.colors.typePrimary,
  [max950]: {
    lineHeight: '32px',
    fontSize: '16px',
    left: 24
  },
  '.brd-icon': {
    marginLeft: 4,
    fontSize: 18,
    [max950]: {
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
  variants: {
    fullpage: {
      true: {
        height: '100vh'
      }
    }
  }
  // '@media (min-width: 950px)': {
  //   background: 'transparent',
  //   backgroundImage: 'unset!important'
  // }
})

export const ContentWrapper = styled('div', {
  position: 'relative',
  height: '100%',
  margin: '0 var(--extra-margin)',
  padding: '0 60px',
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
  [max950]: {
    margin: 0,
    padding: '0 24px'
  },
  variants: {
    verticalCenter: {
      true: {
        justifyContent: 'center'
      }
    },
    verticalBottomMobile: {
      true: {
        [max950]: {
          justifyContent: 'flex-end'
        }
      }
    },
    horizontalRight: {
      true: {
        alignItems: 'flex-end'
      }
    },
    horizontalLeft: {
      true: {
        alignItems: 'flex-start'
      }
    }
  }
})

export const SectionTitle = styled('div', {
  fontWeight: 700,
  fontSize: 46,
  lineHeight: '50px',
  paddingBottom: 14,
  [max950]: {
    fontSize: 24,
    lineHeight: '28px',
    paddingBottom: 15
  },
  variants: {
    sec1: {
      true: {
        fontSize: 88,
        lineHeight: '94px',
        fontWeight: 400,
        b: {
          fontWeight: 700
        },
        [max950]: {
          fontSize: 44,
          lineHeight: '46px'
        }
      }
    },
    sec4: {
      true: {
        color: theme.colors.white
      }
    }
  }
})

export const SectionComment = styled('div', {
  fontWeight: '450',
  fontSize: 18,
  lineHeight: '28px',
  maxWidth: 471,
  width: '100%',
  color: theme.colors.typeSecondary,
  [max950]: {
    fontSize: '16px',
    lineHeight: '28px'
  },
  p: {
    padding: 0,
    margin: 0
  },
  'p + p': {
    marginTop: 26
  },
  variants: {
    sec1: {
      true: {
        maxWidth: 780,
        fontSize: 24,
        lineHeight: '35px'
      }
    },
    sec2: {
      true: {
        paddingBottom: 72,
        [max950]: {
          paddingBottom: 49
        }
      }
    },
    sec3: {
      true: {
        [max950]: {
          paddingBottom: 29
        }
      }
    },
    sec4: {
      true: {
        color: theme.colors.white,
        paddingBottom: 60,
        [max950]: {
          paddingBottom: 26
        }
      }
    },
    sec5: {
      true: {
        maxWidth: 712,
        fontSize: 20,
        lineHeight: '32px',
        fontStyle: 'italic',
        paddingBottom: 60,
        '.mark': {
          transform: 'scale(2)',
          display: 'inline-block',
          position: 'relative',
          top: 10
        },
        '.begin': {
          marginRight: '0.75em'
        },
        '.end': {
          marginLeft: '0.75em'
        },
        '.main': {
          fontSize: 20,
          color: theme.colors.typePrimary
        },
        'p + p': {
          marginTop: 11
        },
        [max950]: {
          paddingBottom: 24,
          'p + p': {
            marginTop: 11
          },
        }
      }
    },
  }
})

export const LinkList = styled('div', {
  paddingTop: 56,
  display: 'flex',
  [max950]: {
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

export const Timeline = styled('div', {
  paddingTop: 88,
  margin: '0 auto',
  position: 'relative',
  [max950]: {
    paddingTop: 56
  },
  '&::before': {
    content: '',
    borderLeft: '1px dashed #ccc',
    position: 'absolute',
    top: 135,
    height: 'calc(100% - 220px)',
    [max950]: {
      top: 70
    }
  }
})

export const TimelineBlock = styled('div', {
  display: 'flex',
  position: 'relative',
  paddingBottom: 56,
  [max950]: {
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
  [max950]: {
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
    [max950]: {
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
    [max950]: {
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
  [max950]: {
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
  [max950]: {
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
  [max950]: {
    flexFlow: 'column nowrap',
    padding: '0 24px',
    flex: 1
  }
})

export const FooterBlock = styled('div', {
  width: 172,

  [max950]: {
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
