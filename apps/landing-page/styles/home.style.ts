import { styled, theme, Button, css } from '@brickdoc/design-system'

export const Page = styled('div', {
  background: theme.colors.white
})

export const SwiperContainer = styled('div', {
  height: '100vh',

  '.swiper': {
    width: '100%',
    height: '100%'
  },

  '.swiper-slide': {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    color: theme.colors.black,
    textAlign: 'left',
    fontFamily: '"42sans"'
  }
})

export const SectionLogoWrapper = styled('div', {
  position: 'absolute',
  top: 46,
  left: 120,
  '@media (max-width: 420px)': {
    left: 24
  }
})

export const SnsLinkWrapper = styled('div', {
  position: 'absolute',
  top: 40,
  right: 140,
  display: 'flex',
  '@media (max-width: 420px)': {
    left: 24
  }
})

export const SnsLink = styled('a', {
  fontWeight: '450',
  fontSize: '22px',
  lineHeight: '44px',
  marginLeft: 24,
  color: theme.colors.typePrimary,
  '.brd-icon': {
    marginLeft: 4,
    fontSize: 20
  },
  '&:hover': {
    textDecoration: 'none',
    opacity: 0.7
  },
  '@media (max-width: 420px)': {
    left: 24
  }
})

export const ContentSection = styled('div', {
  height: '100%',
  width: '100%',
  zIndex: -1,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'center',
  backgroundColor: theme.colors.white
})

export const ContentWrapper = styled('div', {
  position: 'relative',
  height: '100%',
  width: '100%',
  boxSize: 'border-box',
  maxWidth: 1192,
  margin: '0 auto',
  padding: '0 120px',
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'flex-start',
  justifyContent: 'center'
})

export const Section1Title = styled('div', {
  fontWeight: '700',
  fontSize: '80px',
  lineHeight: '90px',
  padding: '80px 0 23px'
})

export const Section1Comment = styled('div', {
  fontWeight: '450',
  fontSize: '32px',
  lineHeight: '47px',
  color: theme.colors.typeSecondary
})

export const Section4Title = styled('div', {
  fontWeight: '700',
  fontSize: '80px',
  lineHeight: '90px',
  padding: '80px 0 23px',
  color: theme.colors.white
})

export const Section4Comment = styled('div', {
  fontWeight: '450',
  fontSize: '32px',
  lineHeight: '47px',
  color: theme.colors.white
})

export const Sec4bg2 = styled('div', {
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'flex-start',
  justifyContent: 'center',
  width: '60%',
  height: '100%',
  background: 'linear-gradient(89.77deg, #151515 57.32%, rgba(21, 21, 21, 0) 90.66%)'
})

export const JoinButton = styled(Button, {
  marginTop: 24,
  width: 392,
  height: 64,
  span: {
    fontSize: '24px'
  },
  '@media (max-width: 420px)': {
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
  '@media (max-width: 420px)': {
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
  alignItems: 'flex-end'
}

export const sec4style = {
  color: theme.colors.white
}

export const Sec4BgFilter = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  background: 'linear-gradient(360deg, rgba(26, 24, 24, 0) 7.23%, rgba(21, 21, 23, 0.3) 86.72%)',
  backdropFilter: 'blur(4px)'
})

export const Timeline = styled('div', {
  paddingTop: 88,
  margin: '0 auto',
  position: 'relative',
  '&::before': {
    content: '',
    borderLeft: '1px dashed #ccc',
    position: 'absolute',
    top: 135,
    height: 'calc(100% - 250px)'
  }
})

export const TimelineBlock = styled('div', {
  display: 'flex',
  position: 'relative',
  paddingBottom: 56
})

export const TimelineContent = styled('div', {
  width: 450,
  paddingLeft: 66,
  '.func-icon': {
    height: 52,
    width: 52,
    borderRadius: 52,
    lineHeight: '56px',
    textAlign: 'center',
    position: 'absolute',
    left: -26,
    top: 32,
    fontSize: 24,
    background: theme.colors.iconPrimary,
    color: theme.colors.white
  },
  '.title': {
    paddingTop: 36,
    fontWeight: '600',
    fontSize: '30px',
    lineHeight: '46px',
    color: theme.colors.typeSecondary
  },
  'sub-title': {
    paddingTop: 8,
    fontWeight: '600',
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

export const TimelinePreview = styled('img', {
  width: 592,
  height: 440
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
    left: 107,
    width: 'calc(100% - 214px)'
  }
})

export const JoinPrivateTitle = styled('div', {
  padding: '35px 0 24px',
  fontSize: '32px',
  lineHeight: '44px'
})

export const ContactBtn = styled(Button, {
  marginTop: 24,
  width: 155,
  height: 52,
  span: {
    fontSize: '24px'
  },
  '@media (max-width: 420px)': {
    width: 236,
    height: 40,
    span: {
      fontSize: '18px'
    }
  }
})

export const Footer = styled('footer', {
  padding: '66px 0 136px',
  display: 'flex',
  maxWidth: 892,
  width: '100%',
  margin: '0 auto',
  justifyContent: 'space-around'
})

export const FooterBlock = styled('div', {
  width: 172,

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
