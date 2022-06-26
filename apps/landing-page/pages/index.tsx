import type { NextPage } from 'next'
import React from 'react'
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
  ActiveBgWrapper,
  SectionTitleWrapper,
  IntegrationList,
  IntegrationListMobile,
  IntegrationListInfo
} from '../styles/home.style'
import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Mousewheel, EffectFade } from 'swiper'

const getExtraMargin = (width: number) => {
  const columnNums = ~~((width + 8) / 60)
  const extraWidth = width - columnNums * 52 - (columnNums - 1) * 8
  return extraWidth / 2
}

const stopframes = [0, 23, 54, 72, 107, 135]
const videoIncrementSpeed = 14 // time per frame in ms(video) 1000/42 = 24fps;
const videoDecrecementSpeed = 14 // time per frame in ms(video) 1000/42 = 24fps;

const integrations = ['github', 'figma', 'aws', 'solid', 'zapier', 'stripe', 'airtable', 'salesforce', 'arweave']
const integrationsMobileSize = [
  [13, 13],
  [9, 13],
  [13, 13],
  [15, 13],
  [13, 13],
  [20, 8],
  [16, 13],
  [19, 13],
  [13, 13]
]
const integrationsSize = [
  [21, 21],
  [14, 21],
  [21, 21],
  [24, 21],
  [21, 21],
  [30, 12],
  [26, 21],
  [30, 21],
  [21, 21]
]

const Home = () => {
  const ref = useRef<null | HTMLVideoElement>(null)
  const [extraMargin, setMargin] = useState(0)
  const [activePage, setActive] = useState(-1)

  const [isScriptEnable, setScriptEnable] = useState(false)
  useEffect(() => {
    setScriptEnable(true)
    setMargin(getExtraMargin(window.innerWidth))
   
    
    if (ref.current) {
      setTimeout(() => {
        ref?.current?.play()
        window.scrollTo(0, 0)
      }, 0);
      
      setActive(0)
      setTimeout(() => {
        if (ref.current) {
          ref.current.pause()
          ref.current.currentTime = stopframes[1] / 24
        }
      }, (stopframes[1] / 24) * 1000)
    }
    const scrollHandler: EventListener = e => {
      const top = window.pageYOffset

      if (top && ref.current) {
        const percent = top / window.innerHeight
        if (percent >= 5) {
          return null
        }
        const stage = ~~percent
        
        const stagePercent = percent - stage

        if (stagePercent > 0.7 && stage !== 4) {
          setActive(-1)
        } else {
          setActive(stage)
        }
        
        const frame = stage === 4 ?
          stopframes[5] :
          stopframes[stage + 1] * (1- stagePercent) + stopframes[stage + 2] * stagePercent
        console.log(frame/24)

        ref.current.currentTime = frame/24
      }
    }

    window.addEventListener('scroll', scrollHandler, true)
    return window.removeEventListener('scroll', scrollHandler)
  }, [])

  const style: React.CSSProperties = { '--extra-margin': `${extraMargin}px` }

  return (
    <Page style={style}>
      <Head>
        <title>Brickdoc</title>
        <meta name="Brickdoc" content="Brickdoc" />
        <link rel="icon" href="/favicon.svg" />
        {isScriptEnable && <script async defer src="https://buttons.github.io/buttons.js" />}
      </Head>

      <ActiveBgWrapper>
        <video className="active-bg" muted playsInline preload="auto" ref={ref}>
          <source src="/home/bg.mp4" type="video/mp4" />
        </video>

        <ContentSection fullpage active={activePage === 0}>
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
            <SectionTitleWrapper>
              <SectionTitle sec1 style={{ paddingBottom: 8 }}>
                A bicycle of the mind to <br />
                <b>Internet OS</b>
              </SectionTitle>
            </SectionTitleWrapper>

            <SectionComment sec1>
              The next iteration of mashup and <b>compound document</b>. <br />
              Create, connect and collaborate with your own docs, widgets, and data in a single place under your
              control.
            </SectionComment>
          </ContentWrapper>
        </ContentSection>

        <ContentSection fullpage active={activePage === 1}>
          <ContentWrapper>
            <SectionTitleWrapper>
              <SectionTitle>
                Meet Human-machine <br />
                Collaboration
              </SectionTitle>
            </SectionTitleWrapper>

            <SectionComment sec2>
              <p>{`Enhancing synergy in modern productivity tool is a movement that will give rise to a platform shift where human and machines complement each other. `}</p>
              <p>{`Create applications in the office suite as if they were documents and apply AI to aid in actions like using excel-like formulas to import live data in apps or calling in external APIs.  `}</p>
            </SectionComment>
          </ContentWrapper>
        </ContentSection>

        <ContentSection fullpage active={activePage === 2}>
          <ContentWrapper verticalCenter horizontalRight horizontalLeftMobile verticalBottom>
            <SectionTitleWrapper>
              <SectionTitle sec3>Integrate everything</SectionTitle>
            </SectionTitleWrapper>
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
              <IntegrationList>
                {integrations.map((item, index) => (
                  <div className="icon-wrapper" key={item}>
                    <Image
                      alt={item}
                      src={`/home/integtations/${item}.svg`}
                      width={integrationsSize[index][0]}
                      height={integrationsSize[index][1]}
                    />
                  </div>
                ))}
              </IntegrationList>
              <IntegrationListMobile>
                {integrations.map((item, index) => (
                  <div className="icon-wrapper" key={item}>
                    <Image
                      alt={item}
                      src={`/home/integtations/${item}.svg`}
                      width={integrationsMobileSize[index][0]}
                      height={integrationsMobileSize[index][1]}
                    />
                  </div>
                ))}
              </IntegrationListMobile>
              <IntegrationListInfo>Planned integrations</IntegrationListInfo>
            </SectionComment>
          </ContentWrapper>
        </ContentSection>

        <ContentSection fullpage active={activePage === 3}>
          <ContentWrapper>
            <SectionTitleWrapper>
              <SectionTitle sec4>
                All your data <br />
                is under your control
              </SectionTitle>
            </SectionTitleWrapper>
            <SectionComment sec4>
              <p>{`MashCard is free and open-source software that can be hosted on your own server or from a cloud provider. `}</p>
              <p>{`As a Solid inspired decentralized data store, any access to the structured data and regular files stored can be granted or revoked as needed to any extent. `}</p>
            </SectionComment>
          </ContentWrapper>
        </ContentSection>

        <ContentSection fullpage active={activePage === 4}>
          <ContentWrapper>
            <SectionComment sec5>
              <p className="main">
                <span className="mark begin">“</span>
                {`A tool that can augment human intelligence should accumulate structured and unstructured information in a single place and have instruments to collaboratively create, mix, connect, visualize and retrieve information. `}
                <span className="mark end">”</span>
              </p>
              <p>- By : Michael Dubakov</p>
            </SectionComment>
          </ContentWrapper>
        </ContentSection>
      </ActiveBgWrapper>

      <ContentWrapper style={{ maxWidth: 'unset' }}>
        <Timeline>
          <div style={{ position: 'relative' }}>
            <div className="time-stikcy-wrapper">
              <div className="time-stikcy">Q3 2022</div>
            </div>
            <TimelineBlock style={{ marginTop: 34 }}>
              <TimelineContent hideInPC>
                <div className="func-icon">
                  <Icon.Formula />
                </div>
                <div className="title">Q3 2022</div>
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
              <TimelineContent hideInPC>
                <div className="func-icon">
                  <Icon.Search />
                </div>

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
              <TimelineContent hideInPC>
                <div className="func-icon">
                  <Icon.Explore />
                </div>

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
          </div>

          <TimelineBlock style={{ marginTop: 34 }}>
            <TimelineContent>
              <div className="func-icon">
                <Icon.Code />
              </div>
              <div className="title">Q4 2022</div>
              <div className="sub-title">Low code</div>
              <div className="detail">
                {`The structuring of data within documents can be realized more flexibly through Turing's Excel
                formula.The structuring of data within documents can be realized more flexibly through Turing's Excel
                formula.`}
              </div>
              <div className="status-tag coming">Coming soon</div>
            </TimelineContent>
            <Image width="770" height="480" src="/home/s4.png" alt="Low code" />
          </TimelineBlock>
          <TimelineBlock style={{ height: 'unset' }}>
            <TimelineContent>
              <div className="func-icon">
                <Icon.Rotation />
              </div>
              <div className="continued-title">To be continued</div>
            </TimelineContent>
          </TimelineBlock>
        </Timeline>
      </ContentWrapper>

      <ContentWrapper doublePadding>
        <JoinBlock>
          <JoinPrivateTitle>Apply to join our Private </JoinPrivateTitle>
          <ContactBtn type="primary">Join the Wait List</ContactBtn>
        </JoinBlock>
      </ContentWrapper>

      <ContentSection style={{ background: theme.colors.backgroundPrimary.value }}>
        <Footer>
          <FooterBlock>
            <div className="desc">
              MashCard is a bicycle of the mind to
              <br />
              Internet OS
            </div>
            <div className="copy">
              Copyright © 2022 Brickdoc Inc. <br />
              Made on Earth by humans.
            </div>
          </FooterBlock>
          <FooterBlock>
            <div className="title">MashCard FOSS</div>
            <div className="link-list">
              <a href="">
                <Icon.ArrowRightSmall />
                License
              </a>
              <a href="">
                <Icon.ArrowRightSmall />
                Code of Conduct
              </a>
              <a href="">
                <Icon.ArrowRightSmall />
                Roadmap
              </a>
              <a href="">
                <Icon.ArrowRightSmall />
                Asked Questions
              </a>
            </div>
          </FooterBlock>
          <FooterBlock>
            <div className="title">Cloud Service</div>
            <div className="link-list width">
              <a href="">
                <Icon.ArrowRightSmall />
                Join the wait list
              </a>
              <a href="">
                <Icon.ArrowRightSmall />
                Privacy Policy
              </a>
              <a href="">
                <Icon.ArrowRightSmall />
                Terms of Service
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
            </div>
          </FooterBlock>
        </Footer>
      </ContentSection>
    </Page>
  )
}

export default Home
