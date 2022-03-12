import { useCallback, useState } from 'react'
import Link from 'next/link'
import { HamburgerButton, Close } from '@brickdoc/design-icons'
import Logo from '@/public/images/logo_en_group.svg'
import LogoMobile from '@/public/images/logo.svg'
import * as Root from './style/nav.style'

export const Nav = () => {
  const [visibility, setVisibility] = useState<boolean>(false)

  const handleMenu = useCallback(() => {
    setVisibility(!visibility)
  }, [setVisibility, visibility])

  return (
    <>
      <Root.Nav>
        <Root.Content>
          <Root.Logo src={Logo} alt="BrickDoc" />
          <Root.Links>
            <Link href="/what" passHref>
              <Root.Item>What</Root.Item>
            </Link>
            <Link href="/why" passHref>
              <Root.Item>Why</Root.Item>
            </Link>
            <Link href="/how" passHref>
              <Root.Item>How</Root.Item>
            </Link>
            <Root.Btn type="primary">Sign In</Root.Btn>
          </Root.Links>
        </Root.Content>
        <Root.ContentMobile>
          {!visibility ? <HamburgerButton onClick={handleMenu} /> : <Close onClick={handleMenu} />}
          <Root.Logo src={LogoMobile} alt="BrickDoc" />

          <Root.Btn
            type="primary"
            size="sm"
            css={{
              visibility: visibility ? 'hidden' : 'unset'
            }}
          >
            Sign In
          </Root.Btn>
        </Root.ContentMobile>

        <Root.Menu display={visibility}>
          <Link href="/what" passHref>
            <Root.Link>What</Root.Link>
          </Link>
          <Link href="/how" passHref>
            <Root.Link>How</Root.Link>
          </Link>
          <Link href="/why" passHref>
            <Root.Link>Why</Root.Link>
          </Link>
        </Root.Menu>
      </Root.Nav>
    </>
  )
}
