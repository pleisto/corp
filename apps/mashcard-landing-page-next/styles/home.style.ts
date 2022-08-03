import { styled, theme, Button } from '@mashcard/design-system'

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
  height: '100%',

  '.swiper': {
    width: '100%',
    height: '100%'
  },

  '.swiper-slide': {
    height: '100%',
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
  height: '100%',

  '.active-bg': {
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    zIndex: -1,
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
    fullpage: {
      true: {
        height: '100%'
      }
    },
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
        }
      }
    },
    join: {
      true: {
        margin: 0,
        padding: `0 ${padPadding * 2}px`,
        background: theme.colors.blue1,
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
  color: theme.colors.typePrimary,
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
    },
  }
})

export const SectionComment = styled('div', {
  fontWeight: 400,
  fontSize: 18,
  lineHeight: '28px',
  maxWidth: 471,
  width: '100%',
  color: theme.colors.grey8,
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
        color: theme.colors.typePrimary,
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
          fontWeight: 600,
          fontSize: 20,
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
  width: '100%',

  variants: {
    fullpage: {
      true: {
        pointerEvents: 'none',
        height: '100%',
        bottom: 0
      }
    },
    active: {
      true: {
        pointerEvents: 'all',
        [SectionComment.toString()]: {
          transition: 'opacity .5s cubic-bezier(0.33, 0.0, 0.2, 1.0) 1s',
          opacity: 1,
          display: 'block'
        },
        [SectionTitle.toString()]: {
          transition: 'transform .5s 1s',
          transform: 'translateY(0%)',
          display: 'block'
        }
      }
    },
    foot: {
      true: {
        background: theme.colors.backgroundSecondary,
        padding: '0 var(--extra-margin)'
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
    top: 155,
    height: 'calc(100% - 250px)',
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
  padding: '150px 0 120px',
  width: '100%',
  [phone]: {
    padding: '72px 0'
  },
  a: {
    textDecoration: 'none!important'
  }
})

export const JoinPrivateTitle = styled('div', {
  fontSize: '46px',
  lineHeight: '50px',
  fontWeight: 700,
  paddingBottom: 96,
  [phone]: {
    fontSize: '28px',
    lineHeight: '40px',
    paddingBottom: 44
  }
})

export const ContactBtn = styled(Button, {
  width: 171,
  height: 40,
  background: theme.colors.primaryDefault,
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
  display: 'flex',
  margin: '0 120px',
  height: 76,
  alignItems: 'center',
  lineHeight: '24px',
  fontSize: 14,
  [phone]: {
    lineHeight: '22px',
    flexFlow: 'column nowrap',
    padding: '37px 0 16px',
    margin: '0 60px',
    height: 'unset'
  },
  '.copy-right': {
    color: theme.colors.typeSecondary,
    [phone]: {
      display: 'none'
    }
  },
  '.copy-right-mobile': {
    display: 'none',
    lineHeight: '24px',
    [phone]: {
      display: 'unset',
      width: 'max-content',
      paddingTop: 20
    }
  },
  '.info-list': {
    flex: 1,
    marginLeft: 100,
    a: {
      color: theme.colors.typePrimary,
      width: 'max-content',
      '&:hover': {
        color: theme.colors.primaryDefault,
        textDecoration: 'none'
      }
    },
    'a + a': {
      marginLeft: 36
    },
    '.mc-icon': {
      display: 'none'
    },
    [phone]: {
      marginLeft: 0,
      display: 'flex',
      flexFlow: 'column nowrap',
      width: '100%',
      a: {
        display: 'flex',
      },
      'a + a': {
        marginLeft: 0,
        marginTop: 19
      },
      '.mc-icon': {
        display: 'inline-block',
        fontSize: 20
      }
    }
  },
  '.sns-list': {
    display: 'flex',
    a: {
      height: 32,
      width: 32,
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        background: theme.colors.secondarySelected
      }
    },

    'a + a': {
      marginLeft: 16
    },

    [phone]: {
      paddingTop: 36,
      'a + a': {
        marginLeft: 36
      }
    }
  }
})

export const IntegrationList = styled('div', {
  paddingTop: 37,
  paddingBottom: 8,
  display: 'flex',
  justifyContent: ' space-between',
  [phone]: {
    display: 'none'
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
  }
})

export const IntegrationListMobile = styled('div', {
  paddingTop: 24,
  paddingBottom: 8,
  display: 'none',
  justifyContent: ' space-between',
  [phone]: {
    display: 'flex'
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
  }
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

export const DockerTips = styled('div', {
  paddingTop: 24,
  fontSize: 14,
  lineHeight: '24px',
  color: theme.colors.typeSecondary
})
