import { FC, useEffect, useMemo, useRef, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script'
import 'swiper/css'
import { Icon } from '@mashcard/design-system'
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
  Page,
  ActiveBgWrapper,
  SectionTitleWrapper,
  IntegrationList,
  IntegrationListMobile,
  IntegrationListInfo,
  DockerTips
} from '../styles/home.style'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Mousewheel, EffectFade } from 'swiper'

const getExtraMargin = (width: number): number => {
  const columnNums = ~~((width + 8) / 60)
  const extraWidth = width - columnNums * 52 - (columnNums - 1) * 8
  return extraWidth / 2
}

const stopFrames = [0, 39, 91, 136, 181, 225]

const videoIncrementSpeed = 14 // time per frame in ms(video) 1000/42 = 24fps;
const videoDecrecementSpeed = 24 // time per frame in ms(video) 1000/42 = 24fps;

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

const Home: FC = () => {
  const ref = useRef<null | HTMLVideoElement>(null)
  const [extraMargin, setMargin] = useState(0)
  const [activePage, setActive] = useState(-1)
  const [isPageInit, setPageEnable] = useState(false)
  const [isEnd, setEnd] = useState(false)
  const [canPlay, setCanplay] = useState(false)
  const isInplay = useRef(false)

  useEffect(() => {
    setTimeout(() => {
      setCanplay(true)
    }, 500);
  }, [])

  useEffect(() => {
    if (canPlay) {
      setPageEnable(true)
      setMargin(getExtraMargin(window.innerWidth))
      

      if (ref.current) {
        setTimeout(async () => {
          try {
            
            window.scrollTo(0, 0)
            await ref?.current?.play()
            isInplay.current = true
            
          } catch (e) {
            // ignore play error
          }
        }, 0)

        setActive(0)
        setTimeout(() => {
          if (ref.current) {
            ref.current.pause()
            isInplay.current = false
            ref.current.currentTime = stopFrames[1] / 24
          }
        }, (stopFrames[1] / 24) * 1000)
      }
    }
  }, [canPlay])

  const scrollHandler = useMemo(
    () => (next: number, prev: number) => {
      if (!ref?.current?.currentTime || !isInplay.current) {
        return
      }
      ref.current.currentTime = stopFrames[prev + 1] / 24
      const targetTime = stopFrames[next + 1] / 24
      const videoPlay = (targetTime: number) => {
        if (!isInplay.current) {
          return
        }
        if (!ref?.current?.currentTime) {
          return
        }
        if (ref?.current?.currentTime === targetTime) {
          return
        }
        const delta = ref?.current?.currentTime - targetTime
        if (Math.abs(delta) < 0.02) {
          isInplay.current = false
          return
        }
        const change = delta > 0 ? -videoDecrecementSpeed : videoIncrementSpeed
        ref.current.currentTime += change / 1000
        requestAnimationFrame(() => videoPlay(targetTime))
      }
      videoPlay(targetTime)
    },
    [ref]
  )

  return (
    <>
      <Page style={{ '--extra-margin': `${extraMargin}px` }}>
        <Head>
          <title>MashCard - A bicycle of the mind to Internet OS</title>
          <link rel="icon" href="/favicon.svg" />
        </Head>
        <ActiveBgWrapper>
          <Swiper
            slidesPerView={1}
            direction="vertical"
            mousewheel={{
              releaseOnEdges: true
            }}
            touchReleaseOnEdges
            pagination={{
              clickable: true
            }}
            speed={500}
            effect="slide"
            fadeEffect={{
              crossFade: true
            }}
            modules={[Pagination, Mousewheel, EffectFade]}
            onSlideChange={swiper => {
              const play = () => {
                isInplay.current = true
                setActive(swiper.activeIndex)
                scrollHandler(swiper.activeIndex, swiper.previousIndex)
                setEnd(swiper.isEnd)
              }
              if (isInplay.current) {
                isInplay.current = false
                console.log('block!!!!')
                setTimeout(play, 200);
              } else {
                play()
              }
            }}>
            <div
              className="active-bg"
              style={{
                background:
                  'url(data:image/png;base64,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) no-repeat',
                backgroundSize: 'cover',
                height: '100vh',
                width: '100%',
                filter: 'blur(5px)'
              }}
            />

            <video className="active-bg" muted playsInline preload="auto" ref={ref}>
              <source src="/home/bg.mp4" type="video/mp4" />
            </video>

            <video
              className="active-bg"
              style={{ opacity: 0 }}
              muted
              playsInline
              preload="auto"
              autoPlay
              onPlay={() => {
                setCanplay(true)
              }}>
              <source src="/home/bg.mp4" type="video/mp4" />
            </video>

            {isPageInit && (
              <>
                <SwiperSlide>
                  <ContentSection fullpage active={activePage === 0}>
                    <ContentWrapper fullpage verticalCenter horizontalLeft>
                      <SectionLogoWrapper>
                        <Image height={30} width={143} src="/home/logo_en_dark.svg" alt="Picture of the author" />
                      </SectionLogoWrapper>
                      <SnsLinkWrapper>
                        {isPageInit && (
                          <>
                            <Script src="https://buttons.github.io/buttons.js" />
                            <a
                              className="github-button"
                              href="https://github.com/mashcard/mashcard"
                              data-icon="octicon-star"
                              data-show-count="true"
                              aria-label="Star mashcard/mashcard on GitHub">
                              Star
                            </a>
                          </>
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
                        Create, connect and collaborate with your own docs, widgets, and data in a single place under
                        your control.
                      </SectionComment>
                    </ContentWrapper>
                  </ContentSection>
                </SwiperSlide>
                <SwiperSlide>
                  <ContentSection fullpage active={activePage === 1}>
                    <ContentWrapper fullpage>
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
                </SwiperSlide>
                <SwiperSlide>
                  <ContentSection fullpage active={activePage === 2}>
                    <ContentWrapper fullpage verticalCenter horizontalRight horizontalLeftMobile verticalBottom>
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
                        OS is essentially a system software that provides interoperability and functionality for
                        applications.
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
                </SwiperSlide>
                <SwiperSlide>
                  <ContentSection fullpage active={activePage === 3}>
                    <ContentWrapper fullpage>
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
                </SwiperSlide>
                <SwiperSlide>
                  <ContentSection fullpage active={activePage === 4}>
                    <ContentWrapper fullpage>
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
                </SwiperSlide>
              </>
            )}
          </Swiper>
        </ActiveBgWrapper>

        {false && (
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
        )}

        {isEnd && (
          <ContentWrapper join>
            <JoinBlock>
              <JoinPrivateTitle>Get early access to MashCard Cloud</JoinPrivateTitle>
              <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=dmapwLdn3k-f734-4EF0b7LKGrywAhpPmy1unh-RMWNUMkQxNkgyM1gzWThKODRYQTc2SE9DNVc5Qy4u">
                <ContactBtn type="primary">Join waitList</ContactBtn>
              </a>
              <DockerTips>Or Download docker image to preview locally</DockerTips>
            </JoinBlock>
          </ContentWrapper>
        )}

        {isEnd && (
          <ContentSection foot>
            <Footer>
              <div className="copy-right">© 2022 Brickdoc Inc. </div>
              <div className="info-list">
                <a href="">
                  <Icon.Right /> Code of Conduct
                </a>
                <a href="">
                  <Icon.Right /> License
                </a>
                <a href="https://github.com/mashcard/mashcard/discussions">
                  <Icon.Right /> Discussions
                </a>
              </div>
              <div className="sns-list">
                <a href="https://www.producthunt.com/upcoming/brickdoc" target="_blank" rel="noreferrer">
                  <Image height={27} width={27} src="/home/link-producthunt.svg" alt="Product Hunt" />
                </a>
                <a href="https://twitter.com/mashcard" target="_blank" rel="noreferrer">
                  <Image height={24} width={24} src="/home/link-twitter.svg" alt="Twitter" />
                </a>
                <a href="https://github.com/mashcard/mashcard" target="_blank" rel="noreferrer">
                  <Image height={26} width={26} src="/home/link-github.svg" alt="Github" />
                </a>
              </div>
              <div className="copy-right-mobile">© 2022 Brickdoc Inc. </div>
            </Footer>
          </ContentSection>
        )}
      </Page>
    </>
  )
}

export default Home
