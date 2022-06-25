import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import 'swiper/css'
import { Icon, theme } from '@mashcard/design-system'
import {
  ContentSection,
  SectionTitle,
  SectionComment,
  ContentWrapper,
  SnsLinkWrapper,
  SectionLogoWrapper,
  Timeline,
  TimelineBlock,
  TimelineContent,
  JoinPrivateTitle,
  ContactBtn,
  JoinBlock,
  Footer,
  FooterBlock,
  Page,
  ActiveBgWrapper
} from '../styles/home.style'
import { useEffect, useMemo, useRef, useState } from 'react'
import { debounce } from '@mashcard/active-support'

const block1bg = 'url(/home/block1.png)'
const block2bg = 'url(/home/block2.png)'
const block3bg = 'url(/home/block3.png)'
const block4bg = 'url(/home/block4.png)'
const block5bg = 'url(/home/block5.png)'

const getExtraMargin = (width: number) => (width + 8) % 60

const end = 0.1

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
        {/* <video className="active-bg" muted playsInline preload="preload" ref={ref}>
          <source src="/home/bg.mp4" type="video/mp4" />
        </video> */}

        <ContentSection fullpage style={{ backgroundImage: block1bg }}>
          <ContentWrapper verticalCenter horizontalLeft>
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
                  aria-label="Star mashcard/mashcard on GitHub">
                  Star
                </a>
              )}
            </SnsLinkWrapper>
            <SectionTitle sec1 style={{ paddingBottom: 8 }}>
              A bicycle of the mind to <br />
              <b>Internet OS</b>
            </SectionTitle>
            <SectionComment sec1>
              The next iteration of mashup and <b>compound document</b>. <br />
              Create, connect and collaborate with your own docs, widgets, and data in a single place under your
              control.
            </SectionComment>
          </ContentWrapper>
        </ContentSection>

        <ContentSection fullpage style={{ backgroundImage: block2bg }}>
          <ContentWrapper>
            <SectionTitle>
              Meet Human-machine <br />
              Collaboration
            </SectionTitle>
            <SectionComment sec2>
              <p>{`Enhancing synergy in modern productivity tool is a movement that will give rise to a platform shift where human and machines complement each other. `}</p>
              <p>{`Create applications in the office suite as if they were documents and apply AI to aid in actions like using excel-like formulas to import live data in apps or calling in external APIs.  `}</p>
            </SectionComment>
          </ContentWrapper>
        </ContentSection>

        <ContentSection fullpage style={{ backgroundImage: block3bg }}>
          <ContentWrapper verticalCenter verticalBottomMobile>
            <SectionTitle>Integrate everything</SectionTitle>
            <SectionComment sec3>
              {`With the exponential rate that SaaS is eating the world, RPA and automated workflows are not able to
              satiate anymore.`}
              <br />
              {`The people needs instead an Internet OS that can connect, modify and share structured data between sources
              as easily as copy-paste.`}
              <br />
              {`OS is essentially a system software that provides interoperability and functionality for applications.`}
              <br />
              {`MashCard is an Internet OS with micro-kernel architecture that provides a WordPress-like plugin system to
              build, customize and express on top of it for an enhanced experience.`}
            </SectionComment>
          </ContentWrapper>
        </ContentSection>

        <ContentSection
          fullpage
          style={{
            backgroundImage: block4bg
          }}>
          <ContentWrapper>
            <SectionTitle sec4>
              All your data <br />
              is under your control
            </SectionTitle>
            <SectionComment sec4>
              <p>{`MashCard is free and open-source software that can be hosted on your own server or from a cloud provider. `}</p>
              <p>{`As a Solid inspired decentralized data store, any access to the structured data and regular files stored can be granted or revoked as needed to any extent. `}</p>
            </SectionComment>
          </ContentWrapper>
        </ContentSection>

        <ContentSection
          fullpage
          style={{
            backgroundImage: block5bg
          }}>
          <ContentWrapper>
            <SectionComment sec5>
              <p className='main'>
                <span className="mark begin">“</span>
                {`A tool that can augment human intelligence should accumulate structured and unstructured information in a single place and have instruments to collaboratively create, mix, connect, visualize and retrieve information. `}
                <span className="mark end">”</span>
              </p>
              <p>-  By : Michael Dubakov</p>
            </SectionComment>
          </ContentWrapper>
        </ContentSection>
      </ActiveBgWrapper>

      <ContentWrapper style={{ maxWidth: 'unset' }}>
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
