import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import 'swiper/css'
import { Icon, theme } from '@mashcard/design-system'
import {
  ContentSection,
  SectionTitle,
  SectionComment,
  JoinButton,
  ContentWrapper,
  SnsLinkWrapper,
  SectionLogoWrapper,
  sec3style,
  sec4style,
  Timeline,
  TimelineBlock,
  TimelineContent,
  JoinPrivateTitle,
  ContactBtn,
  JoinBlock,
  Footer,
  FooterBlock,
  Page,
  section1ContentCls,
  ActiveBgWrapper
} from '../styles/home.style'
import { useEffect, useMemo, useRef, useState } from 'react'
import { debounce } from '@mashcard/active-support'

const block1bg = 'url(/home/block1.png)'
const block2bg = 'url(/home/block2.png)'
const block3bg = 'url(/home/block3.png)'
const block4bg = 'url(/home/block4.png)'

const getExtraMargin = (width: number) => (width + 8) % 60

const end = 16

const Home: NextPage = () => {
  const [extraMargin, setMargin] = useState(0)
  const [isEnd, setIsEnd] = useState(false)
  const [isScriptEnable, enableScript] = useState(false)
  const ref = useRef<null | HTMLVideoElement>(null)
  useEffect(() => setMargin(getExtraMargin(window.innerWidth)), [])
  useEffect(() => enableScript(true), [])
  useEffect(() => {
    const cb = debounce(() => {
      setMargin(getExtraMargin(window.innerWidth))
    }, 100)
    window.addEventListener('resize', cb)
    return () => window.removeEventListener('resize', cb)
  }, [setMargin])
  useEffect(() => {
    const setTime = (time: number) => {
      if (ref?.current?.currentTime !== undefined) {
        ref.current.currentTime = time
      }
    }
    const scrollPlay = () => {
      if (window.pageYOffset > 3 * window.innerHeight) {
        setTime(end)
        setIsEnd(true)
      } else {
        setIsEnd(false)
        setTime((window.pageYOffset / 3 / window.innerHeight) * end)
      }
    }
    window.addEventListener('scroll', scrollPlay)
  }, [setIsEnd])
  const style = useMemo(() => {
    const variables: React.CSSProperties = {
      '--extra-margin': `${extraMargin}px`,
      '--scroll-align': isEnd ? 'none' : 'start end'
    }
    return variables
  }, [isEnd, extraMargin])
  return (
    <Page style={style}>
      <Head>
        <title>Brickdoc</title>
        <meta name="Brickdoc" content="Brickdoc" />
        <link rel="icon" href="/favicon.svg" />
        {isScriptEnable && <script async defer src="https://buttons.github.io/buttons.js" />}
      </Head>
      <ActiveBgWrapper end={isEnd}>
        <video className="active-bg" muted playsInline preload="preload" ref={ref}>
          <source src="/home/bg.mp4" type="video/mp4" />
        </video>
        <ContentSection fullpage style={{ backgroundImage: block1bg }}>
          <ContentWrapper className={section1ContentCls}>
            <SectionLogoWrapper>
              <Image height={32} width={138} src="/home/logo_en_dark.svg" alt="Picture of the author" />
            </SectionLogoWrapper>
            <SnsLinkWrapper>
              {isScriptEnable && (
                <a
                  className="github-button"
                  href="https://github.com/mashcard/mashcard"
                  data-icon="octicon-star"
                  data-show-count="true"
                  aria-label="Star mashcard/mashcard on GitHub"
                >
                  Star
                </a>
              )}
            </SnsLinkWrapper>

            <SectionTitle style={{ paddingBottom: 8 }}>Made on Earth by Humans</SectionTitle>
            <SectionComment>
              Brickdoc is an open source online workspace and low-code development platform with Compound Document as
              its core.
            </SectionComment>
            <JoinButton type="primary">Apply to Join Our Private</JoinButton>
          </ContentWrapper>
        </ContentSection>

        <ContentSection fullpage style={{ backgroundImage: block2bg }}>
          <ContentWrapper>
            <SectionTitle>Man-computer Symbiosis</SectionTitle>
            <SectionComment sec1commont>
              {`Advances in technology are blurring the lines between humans and machines, and Brickdoc is a low-code tool designed around the concept of "Intelligence Augmentation".`}
            </SectionComment>
          </ContentWrapper>
        </ContentSection>

        <ContentSection fullpage style={{ backgroundImage: block3bg }}>
          <ContentWrapper css={sec3style}>
            <SectionTitle>Semantic Highway</SectionTitle>
            <SectionComment sec2commont>
              {`Brickdoc provides a network for everyone and all programs to understand that it is the same thing.
                  You'll focus on topics in a collaborative work environment with hundreds of people and businesses. All
                  old data and new tools will be at your fingertips.`}
            </SectionComment>
          </ContentWrapper>
        </ContentSection>

        <ContentSection
          fullpage
          style={{
            backgroundImage: block4bg
          }}
        >
          <ContentWrapper css={sec4style}>
            <SectionTitle>Transfer of Rights</SectionTitle>
            <SectionComment sec3commont>
              {`Open source is the global democratization of an open, shared, collaborative model. `}
            </SectionComment>
          </ContentWrapper>
        </ContentSection>
      </ActiveBgWrapper>
      <ContentWrapper style={{ maxWidth: 'unset' }}>
        {' '}
        <Timeline>
          <TimelineBlock>
            <TimelineContent>
              <div className="func-icon">
                <Icon.Formula />
              </div>
              <div className="title">2022 Q1</div>
              <div className="sub-title">FORMULA</div>
              <div className="detail">
                {`The structuring of data within documents can be realized more flexibly through Turing's Excel
                formula.The structuring of data within documents can be realized more flexibly through Turing's Excel
                formula.`}
              </div>
              <div className="status-tag">Online</div>
            </TimelineContent>
            <Image width="770" height="480" src="/home/s1.png" alt="FORMULA" />
          </TimelineBlock>
          <TimelineBlock>
            <TimelineContent>
              <div className="func-icon">
                <Icon.Search />
              </div>
              <div className="title">2022 Q3</div>
              <div className="sub-title">Smart Search</div>
              <div className="detail">
                {`The structuring of data within documents can be realized more flexibly through Turing's Excel
                formula.The structuring of data within documents can be realized more flexibly through Turing's Excel
                formula.`}
              </div>
              <div className="status-tag">Online</div>
            </TimelineContent>
            <Image width="770" height="480" src="/home/s2.png" alt="Smart Search" />
          </TimelineBlock>
          <TimelineBlock>
            <TimelineContent>
              <div className="func-icon">
                <Icon.Explore />
              </div>
              <div className="title">2022 Q3</div>
              <div className="sub-title">Plug Store</div>
              <div className="detail">
                {`The structuring of data within documents can be realized more flexibly through Turing's Excel
                formula.The structuring of data within documents can be realized more flexibly through Turing's Excel
                formula.`}
              </div>
              <div className="status-tag">Online</div>
            </TimelineContent>
            <Image width="770" height="480" src="/home/s3.png" alt="Plug Store" />
          </TimelineBlock>
          <TimelineBlock>
            <TimelineContent>
              <div className="func-icon">
                <Icon.Code />
              </div>
              <div className="title">2022 Q3</div>
              <div className="sub-title">Low code</div>
              <div className="detail">
                {`The structuring of data within documents can be realized more flexibly through Turing's Excel
                formula.The structuring of data within documents can be realized more flexibly through Turing's Excel
                formula.`}
              </div>
              <div className="status-tag">Coming soon</div>
            </TimelineContent>
            <Image width="770" height="480" src="/home/s4.png" alt="Low code" />
          </TimelineBlock>
          <TimelineBlock>
            <TimelineContent>
              <div className="func-icon">
                <Icon.Rotation />
              </div>
              <div className="title">2022 Q4</div>
              <div className="sub-title">To be continued</div>
              <div className="status-tag coming">Coming soon</div>
            </TimelineContent>
          </TimelineBlock>
        </Timeline>
      </ContentWrapper>

      <JoinBlock>
        <JoinPrivateTitle>Apply to join our Private </JoinPrivateTitle>
        <ContactBtn type="primary">Contact Us</ContactBtn>
      </JoinBlock>
      <ContentSection style={{ background: theme.colors.backgroundPrimary.value }}>
        <Footer>
          <FooterBlock>
            <div className="desc">Brickdoc Is the New Electricity to Power Your Thinking</div>
            <div className="copy">Copyright © 2021 Brickdoc Inc. All rights reserved. Made on Earth by humans.</div>
          </FooterBlock>
          <FooterBlock>
            <div className="title">About Us</div>
            <div className="link-list">
              <a href="">
                <Icon.ArrowRightSmall />
                Our Promise
              </a>
              <a href="">
                <Icon.ArrowRightSmall />
                Terms & Conditions
              </a>
              <a href="">
                <Icon.ArrowRightSmall />
                Privacy Policy
              </a>
              <a href="">
                <Icon.ArrowRightSmall />
                Asked Questions
              </a>
            </div>
          </FooterBlock>
          <FooterBlock>
            <div className="title">The Product</div>
            <div className="link-list">
              <a href="">
                <Icon.ArrowRightSmall />
                Why People Love Us
              </a>
            </div>
            <div className="title">Help</div>
            <div className="link-list">
              <a href="">
                <Icon.ArrowRightSmall />
                Sign In{' '}
              </a>
              <a href="">
                <Icon.ArrowRightSmall />
                Create a New Account
              </a>
            </div>
          </FooterBlock>
          <FooterBlock>
            <div className="title">Contact Us</div>
            <div className="link-list">
              <a href="">
                <Icon.ArrowRightSmall />
                <Image height={20} width={20} src="/home/link-producthunt.svg" alt="Producthunt" />
                <div className="text-offset">Producthunt</div>
              </a>
              <a href="">
                <Icon.ArrowRightSmall />
                <Image height={20} width={20} src="/home/link-twitter.svg" alt="Twitter" />
                <div className="text-offset">Twitter</div>
              </a>
              <a href="">
                <Icon.ArrowRightSmall />
                <Image height={20} width={20} src="/home/link-github.svg" alt="Github" />
                <div className="text-offset">Github</div>
              </a>
              <a href="">
                <Icon.ArrowRightSmall />
                <Image height={20} width={20} src="/home/link-Facebook.svg" alt="Facebook" />
                <div className="text-offset">Facebook</div>
              </a>
              <a href="">
                <Icon.ArrowRightSmall />
                <div className="bug-wrapper">
                  <Icon.Bug />
                </div>
                <div className="text-offset">Report a Bug</div>
              </a>
            </div>
          </FooterBlock>
        </Footer>
      </ContentSection>
    </Page>
  )
}

export default Home
