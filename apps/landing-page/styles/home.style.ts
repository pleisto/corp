import { styled, keyframes, theme, Button } from '@mashcard/design-system'

const phone = '@media (max-width: 950px)'
const pad = '@media (min-device-width: 951px) and (max-device-width: 1200px)'

const pcPadding = 120
const padPadding = 60
const phonePadding = 24

export const SectionTitleWrapper = styled('div', {
  overflow: 'hidden'
})

export const Page = styled('div', {
  background: theme.colors.white,
  boxSize: 'border-box',

  '.swiper': {
    width: '100%',
    height: '100vh'
  },

  '.swiper-slide': {
    height: '100vh',
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    color: theme.colors.black,
    fontFamily: '"42sans"'
  }
})

export const ActiveBgWrapper = styled('div', {
  position: 'relative',
  '.active-bg': {
    position: 'sticky',
    top: 0,
    bottom: 0,
    height: '100vh',
    width: '100%',
    objectFit: 'cover',
  }
})

export const SectionLogoWrapper = styled('div', {
  position: 'absolute',
  top: 40,
  left: pcPadding,
  width: 138,
  height: 32,
  [pad]: {
    left: padPadding
  },
  [phone]: {
    top: 16,
    left: phonePadding,
    width: 99,
    height: 24
  }
})

export const SnsLinkWrapper = styled('div', {
  position: 'absolute',
  top: 46,
  right: pcPadding,
  display: 'flex',
  a: {
    color: 'transparent'
  },
  [pad]: {
    right: padPadding
  },
  [phone]: {
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
  [phone]: {
    lineHeight: '32px',
    fontSize: '16px',
    left: 24
  },
  '.brd-icon': {
    marginLeft: 4,
    fontSize: 18,
    [phone]: {
      marginLeft: 14,
      fontSize: '12px'
    }
  },
  '&:hover': {
    textDecoration: 'none',
    opacity: 0.7
  }
})

export const ContentWrapper = styled('div', {
  position: 'relative',
  height: '100%',
  margin: '0 var(--extra-margin)',
  padding: `0 ${pcPadding}px`,
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
  [phone]: {
    margin: 0,
    padding: '0 24px'
  },
  [pad]: {
    padding: `0 ${padPadding}px`
  },
  variants: {
    verticalCenter: {
      true: {
        justifyContent: 'center'
      }
    },
    verticalBottom: {
      true: {
        justifyContent: 'flex-end'
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
    },
    horizontalLeftMobile: {
      true: {
        [phone]: {
          alignItems: 'flex-start'
        },
      }
    },
    doublePadding: {
      true: {
        pad: `0 ${padPadding * 2}px`,
        [phone]: {
          justifyContent: `0 ${padPadding * 2}px`
        },
        [phone]: {
          padding: '0 24px'
        }
      }
    }
  }
})

export const SectionTitle = styled('div', {
  fontWeight: 700,
  fontSize: 46,
  lineHeight: '50px',
  paddingBottom: 14,
  transform: 'translateY(100%)',
  [phone]: {
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
        [phone]: {
          fontSize: 44,
          lineHeight: '46px'
        }
      }
    },
    sec3: {
      true: {
        width: 471,
        [phone]: {
          width: 'unset'
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
  fontWeight: 400,
  fontSize: 18,
  lineHeight: '28px',
  maxWidth: 471,
  width: '100%',
  color: theme.colors.typeSecondary,
  opacity: 0,
  [phone]: {
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
        [phone]: {
          paddingBottom: 49
        }
      }
    },
    sec3: {
      true: {
        [phone]: {
          paddingBottom: 29
        }
      }
    },
    sec4: {
      true: {
        color: theme.colors.white,
        paddingBottom: 60,
        [phone]: {
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
        [phone]: {
          paddingBottom: 24,
          'p + p': {
            marginTop: 11
          }
        }
      }
    }
  }
})

export const ContentSection = styled('div', {
  height: '100%',
  width: '100%',

  variants: {
    fullpage: {
      true: {
        height: '100vh',
        position: 'sticky',
        bottom: 0,
      }
    },
    active: {
      true: {
        [SectionComment.toString()]: {
          transition: 'opacity 2s cubic-bezier(0.33, 0.0, 0.2, 1.0)',
          opacity: 1,
          display: 'block',
        },
        [SectionTitle.toString()]: {
          transition: 'transform 0.6s 0.2s',
          transform: 'translateY(0%)',
          display: 'block',
        }
      }
    }
  }
})

export const LinkList = styled('div', {
  paddingTop: 56,
  display: 'flex',
  [phone]: {
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
  paddingTop: 56,
  margin: '0 auto',
  position: 'relative',
  [phone]: {
    paddingTop: 56
  },
  '.time-stikcy-wrapper': {
    position: 'absolute',
    top: 0,
    left: '66px',
    height: 'calc(100% - 330px)',
    color: theme.colors.typeSecondary,
    zIndex: 1,
    [phone]: {
      display: 'none'
    },
    '.time-stikcy': {
      position: 'sticky',
      top: 0,
      fontWeight: '600',
      fontSize: '32px',
      lineHeight: '52px',
      width: 260,
      background: 'linear-gradient(180deg, #ffff 0%, #fffe 50%, #fff0)'
    }
  },
  '&::before': {
    content: '',
    borderLeft: '1px dashed #ccc',
    position: 'absolute',
    top: 135,
    height: 'calc(100% - 520px)',
    [phone]: {
      top: 110,
      height: 'calc(100% - 160px)'
    }
  }
})

export const TimelineBlock = styled('div', {
  display: 'flex',
  position: 'relative',
  paddingBottom: 56,
  height: 452,
  [phone]: {
    height: 'unset',
    flexFlow: 'column',
    padding: '0 0 56px 25px',
    '&:last-child': {
      paddingBottom: 22
    }
  },
  img: {
    borderRadius: 16
  }
})

export const TimelineContent = styled('div', {
  width: 396,
  flexShrink: 0,
  padding: '52px 70px 0 66px',
  height: 'fit-content',
  position: 'sticky',
  top: 0,
  bottom: 0,
  variants: {
    hideInPC: {
      true: {
        '.title': {
          display: 'none',
          [phone]: {
            display: 'unset'
          }
        }
      }
    }
  },

  [phone]: {
    padding: '0 0',
    width: 'unset',
    position: 'unset'
  },
  '.func-icon': {
    height: 32,
    width: 32,
    borderRadius: 32,
    lineHeight: '32px',
    textAlign: 'center',
    position: 'absolute',
    left: -15,
    top: 52,
    fontSize: 20,
    background: theme.colors.iconPrimary,
    color: theme.colors.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [phone]: {
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
    fontWeight: '600',
    fontSize: '32px',
    lineHeight: '52px',
    color: theme.colors.typeSecondary,
    position: 'absolute',
    top: 0,
    [phone]: {
      paddingTop: 0,
      paddingBottom: 2,
      fontSize: '22px',
      lineHeight: '32px',
      top: -34
    }
  },
  '.sub-title': {
    fontSize: '18px',
    lineHeight: '36px',
    color: theme.colors.typePrimary,
    fontWeight: 700
  },
  '.continued-title': {
    fontWeight: '600',
    fontSize: '32px',
    lineHeight: '52px',
    color: theme.colors.typeSecondary,
    transform: 'translateY(-10px)',
    [phone]: {
      fontSize: '22px',
      lineHeight: '32px',
      transform: 'translateY(0)'
    }
  },
  '.detail': {
    fontWeight: '450',
    fontSize: '18px',
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
    [phone]: {
      marginBottom: 24
    },

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
  width: '100%',
  borderTop: `1px solid ${theme.colors.dividerPrimary}`
})

export const JoinPrivateTitle = styled('div', {
  padding: '40px 0',
  fontSize: '46px',
  lineHeight: '50px',
  fontWeight: 700,
  [phone]: {
    padding: '35px 0',
    fontSize: '26px',
    lineHeight: '28px'
  }
})

export const ContactBtn = styled(Button, {
  width: 171,
  height: 40,
  span: {
    fontSize: '18px'
  },
  [phone]: {
    width: 155,
    height: 32,
    span: {
      fontSize: '16px'
    }
  }
})

export const Footer = styled('footer', {
  padding: '88px 0 120px',
  display: 'flex',
  maxWidth: 892,
  width: '100%',
  margin: '0 auto',
  justifyContent: 'space-around',
  [phone]: {
    flexFlow: 'column nowrap',
    padding: '44px 24px 0',
    flex: 1
  }
})

export const FooterBlock = styled('div', {
  width: 172,
  marginRight: 68,

  '&:last-child': {
    marginRight: 0
  },

  [phone]: {
    width: 'unset',
    marginRight: 0,
    paddingBottom: 24
  },

  '.desc': {
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '28px',
    marginBottom: 24
  },

  '.copy': {
    fontWeight: '450',
    fontSize: '14px',
    lineHeight: '28px',
    color: theme.colors.typeSecondary
  },

  '.title': {
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '28px',
    paddingBottom: 20
  },

  '.link-list': {
    fontWeight: '450',
    display: 'flex',
    flexFlow: 'column nowrap',
    [phone]: {
      paddingBottom: 36
    },
    a: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      lineHeight: '24px',
      color: theme.colors.typePrimary,
      '.mc-icon': {
        fontSize: '16px',
        marginRight: 4,
        color: theme.colors.iconThirdary
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
    },
    'a + a': {
      marginTop: 10
    },

    '&.width': {
      'a + a': {
        marginTop: 24,
        [phone]: {
          marginTop: 16
        }
      }
    }
  }
})

export const IntegrationList = styled('div', {
  paddingTop: 87,
  paddingBottom: 8,
  display: 'flex',
  justifyContent:' space-between',
  [phone]: {
    display: 'none',
  },
  '.icon-wrapper': {
    height: 39,
    width: 39,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '0.2px solid #F0F0F0',
    boxShadow: ' 0px 2px 4px rgba(44, 91, 255, 0.02), 0px 4px 4px rgba(0, 0, 0, 0.04)',
    borderRadius: 4,
    background: 'linear-gradient(0deg, rgba(251, 251, 251, 0.38), rgba(251, 251, 251, 0.38))'
  },

})

export const IntegrationListMobile = styled('div', {
  paddingTop: 24,
  paddingBottom: 8,
  display: 'none',
  justifyContent:' space-between',
  [phone]: {
    display: 'flex',
    
  },
  '.icon-wrapper': {
    height: 23,
    width: 23,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '0.2px solid #F0F0F0',
    boxShadow: ' 0px 2px 4px rgba(44, 91, 255, 0.02), 0px 4px 4px rgba(0, 0, 0, 0.04)',
    borderRadius: 4,
    background: 'linear-gradient(0deg, rgba(251, 251, 251, 0.38), rgba(251, 251, 251, 0.38))'
  },
})

export const IntegrationListInfo = styled('div', {
  fontWeight: '450',
  fontSize: '15px',
  lineHeight: '30px',
  color: theme.colors.grey6,
  paddingBottom: 148,
  [phone]: {
    paddingBottom: 0
  }
})
