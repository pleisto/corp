import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Icon, theme } from '@mashcard/design-system'
import {
  SectionWrapper,
  FullPageScrollContainer,
  NormalScrollContainer,
  MainContainer,
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
  BgWrapper
} from '../styles/home.style'
import { useEffect, useRef, useState } from 'react'
import { debounce } from '@mashcard/active-support'

// Full page scroll animation property
const animationTime = 400
const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
  t /= d / 2
  if (t < 1) return (c / 2) * t * t + b
  t--
  return (-c / 2) * (t * (t - 2) - 1) + b
}

const block1bg = 'url(/home/block1.png)'
const block2bg = 'url(/home/block2.png)'
const block3bg = 'url(/home/block3.png)'
const block4bg = 'url(/home/block4.png)'
const block5bg = 'url(/home/block5.png)'

const getExtraMargin = (width: number) => {
  const columnNums = ~~((width + 8) / 60)
  const extraWidth = width - columnNums * 52 - (columnNums - 1) * 8
  return extraWidth / 2
}

const pageNum = 5

const Home: NextPage = () => {
  const [extraMargin, setMargin] = useState(0)
  const [isScriptEnable, enableScript] = useState(false)

  const ref = useRef<null | HTMLVideoElement>(null)
  const clip1 = useRef<null | HTMLDivElement>(null)
  const clip2 = useRef<null | HTMLDivElement>(null)
  const clip3 = useRef<null | HTMLDivElement>(null)
  const clip4 = useRef<null | HTMLDivElement>(null)
  const clip5 = useRef<null | HTMLDivElement>(null)

  const clipArray = [clip1, clip2, clip3, clip4, clip5]

  const noramlText1 = useRef<null | HTMLDivElement>(null)
  const noramlText2 = useRef<null | HTMLDivElement>(null)
  const noramlText3 = useRef<null | HTMLDivElement>(null)
  const noramlText4 = useRef<null | HTMLDivElement>(null)
  const noramlText5 = useRef<null | HTMLDivElement>(null)

  const ntArray = [noramlText1, noramlText2, noramlText3, noramlText4, noramlText5]
  const [innerHeight, setInnerHeight] = useState(0)

  const [isEnableFPScroll, setIsEnableFPScroll] = useState(false)
  const [currentPage, setCurrentPage] = useState(-1)
  const [prevPage, setPrevPage] = useState(0)

  useEffect(() => {
    //init scroll pos
    window.scrollTo(0, 0)
    //enable full page scroll
    setIsEnableFPScroll(true)
    //disable normal scroll
    disableNormalScrolling()
    setPrevPage(-1)
    setCurrentPage(0)

    setMargin(getExtraMargin(window.innerWidth))
    //measure window height
    setInnerHeight(window.innerHeight)
  }, [])

  useEffect(() => {
    const cb = debounce(() => {
      setMargin(getExtraMargin(window.innerWidth))
      //measure window height
      setInnerHeight(window.innerHeight)
    }, 100)
    window.addEventListener('resize', cb)
    return () => window.removeEventListener('resize', cb)
  }, [setMargin])

  useEffect(() => enableScript(true), [])

  //TODO: Key Event
  const onWheel = event => {
    //wheel event on MainContainer
    if (isEnableFPScroll) {
      if (currentPage === pageNum - 1) {
        if (event.deltaY > 0) {
          enableNormalScrolling()
        }
      }
      // wheel down
      if (event.deltaY > 0 && currentPage != pageNum - 1) {
        setPrevPage(currentPage)
        setCurrentPage(Math.min(pageNum - 1, Math.max(0, currentPage + 1)))
        setIsEnableFPScroll(false)
      }
      // wheel up
      else if (event.deltaY < 0 && currentPage != 0) {
        setPrevPage(currentPage)
        setCurrentPage(Math.min(pageNum - 1, Math.max(0, currentPage - 1)))
        setIsEnableFPScroll(false)
      }
    }
  }

  useEffect(() => {
    // only animate when from/to is different

    // if(prevPage != -1){
    //   clipArray[prevPage].current.style.transition = 'all 0.3s cubic-bezier(0.33, 0.0, 0.2, 1.0) 0.1s';
    //   ntArray[prevPage].current.style.transition = 'all 0.4s';
    //   clipArray[prevPage].current.style.transform = 'translateY(-100%)';
    //   ntArray[prevPage].current.style.opacity = '0';
    // }
    if(currentPage != -1){
      console.log('here')
      clipArray[currentPage].current.style.transition = 'all 0s';
      ntArray[currentPage].current.style.transition = 'all 0s';
      clipArray[currentPage].current.style.transform = 'translateY(100%)';
      ntArray[currentPage].current.style.opacity = '0';
    }



    if(currentPage != prevPage){
      var start = window.scrollY, //prevPage*innerHeight
          to = currentPage*innerHeight,
          change = to - start,
          currentTime = 0,
          increment = 16; // time per frame in ms(scroll) 1000/16 = 60fps;

      var animateScroll = () =>{        
          currentTime += increment;
          var val = easeInOutQuad(currentTime, start, change, animationTime);
          window.scrollTo(0,val);
          window.scrollY = val;
          disableNormalScrolling()
          //OnAnimation
          if(currentTime < animationTime) {
            setTimeout(animateScroll, increment);
          }
          //Animation End
          else{
            window.scrollTo(0,to);
            window.scrollY = to;
            
            // if(currentPage === pageNum - 1){
            //   setIsEnableFPScroll(false)
            //   enableNormalScrolling()
            // }
            // else{
            //   setIsEnableFPScroll(true)
            //   disableNormalScrolling()
            // }
          }
      };

      // 0-61 init
      // 61-168 scene1->2
      // ..
      // 377-450 scen4->5

      const stopframes = [0,61,168, 225, 377,450];
      var videoIncrementSpeed = 24;// time per frame in ms(video) 1000/42 = 24fps;
      var videoDecrecementSpeed = 100;// time per frame in ms(video) 1000/42 = 24fps;
      console.log(currentPage)
      var videoPlay = () =>{
        // scroll down
        if(currentPage>prevPage){
          //OnAnimation
          if (ref?.current?.currentTime < stopframes[currentPage+1]/24) {
            if (ref?.current?.currentTime !== undefined) {
              ref.current.currentTime += videoIncrementSpeed/1000;
            }
            requestAnimationFrame(videoPlay);
          }
          //Animation End
          else{
            // video time is always greater than scroll animation time,so lock the scroll until the video finished playing
            
            if(currentPage != -1){
              clipArray[currentPage].current.style.transition = 'all 0.8s cubic-bezier(0.33, 0.0, 0.2, 1.0)';
              ntArray[currentPage].current.style.transition = 'all 0.6s 0.2s';
              clipArray[currentPage].current.style.transform = 'translateY(0%)';
              ntArray[currentPage].current.style.opacity = '1';
            }

            if(currentPage === pageNum - 1){
              setIsEnableFPScroll(false)
              enableNormalScrolling()
            }
            else{
              setIsEnableFPScroll(true)
              disableNormalScrolling()
            }

          }
        }
        // scroll up
        if(currentPage<prevPage){
          //OnAnimation
          if (ref?.current?.currentTime > stopframes[currentPage+1]/24) {
            if (ref?.current?.currentTime !== undefined) {
              ref.current.currentTime -= videoDecrecementSpeed/1000;
            }
            requestAnimationFrame(videoPlay);
          }
          //Animation End
          else{
            //video time is always greater than scroll animation time,so lock the scroll until the video finished playing
            if(currentPage != -1){
              clipArray[currentPage].current.style.transition = 'all 0.8s cubic-bezier(0.33, 0.0, 0.2, 1.0)';
              ntArray[currentPage].current.style.transition = 'all 0.6s 0.2s';
              clipArray[currentPage].current.style.transform = 'translateY(0%)';
              ntArray[currentPage].current.style.opacity = '1';
            }

            if(currentPage === pageNum - 1){
              setIsEnableFPScroll(false)
              enableNormalScrolling()
            }
            else{
              setIsEnableFPScroll(true)
              disableNormalScrolling()
            }

          }
        }
        
      }
      

      animateScroll();
      requestAnimationFrame(videoPlay);
      
    }

  }, [currentPage])

  const disableNormalScrolling = () =>{
    var y=window.scrollY;
    window.onscroll = () => {
      window.scrollTo(0, y);
    };
  }

  const enableNormalScrolling = () =>{ 
    var y=window.scrollY;
    window.onscroll = () =>{
      if(window.pageYOffset<(pageNum-1)*innerHeight){
        window.scrollY = window.pageYOffset
        window.scrollTo(0, window.scrollY);
        disableNormalScrolling()
        setIsEnableFPScroll(true)
      }
      else{
        setIsEnableFPScroll(false)
        window.scrollTo(0, Math.max((pageNum-1)*innerHeight,window.pageYOffset));
      }
    };
  }

  const style:React.CSSProperties = {
    '--extra-margin': `${extraMargin}px`
  }

  return (
    <Page style={style}>
      <Head>
        <title>Brickdoc</title>
        <meta name="Brickdoc" content="Brickdoc" />
        <link rel="icon" href="/favicon.svg" />
        {isScriptEnable && <script async defer src="https://buttons.github.io/buttons.js" />}
      </Head>

      <MainContainer onWheel={onWheel}>
        <FullPageScrollContainer>
          <BgWrapper className="active-bg" muted playsInline preload="preload" ref={ref}>
            <source src="/home/bg.mp4" type="video/mp4" />
          </BgWrapper>

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
              <SectionWrapper>
                <SectionTitle ref={clip1} sec1 style={{ paddingBottom: 8 }}>
                  A bicycle of the mind to <br />
                  <b>Internet OS</b>
                </SectionTitle>
              </SectionWrapper>

              <SectionComment ref={noramlText1} sec1>
                The next iteration of mashup and <b>compound document</b>. <br />
                Create, connect and collaborate with your own docs, widgets, and data in a single place under your
                control.
              </SectionComment>
            </ContentWrapper>
          </ContentSection>

          <ContentSection fullpage style={{ backgroundImage: block2bg }}>
            <ContentWrapper>
              <SectionWrapper>
                <SectionTitle ref={clip2}>
                  Meet Human-machine <br />
                  Collaboration
                </SectionTitle>
              </SectionWrapper>
              <SectionComment ref={noramlText2} sec2>
                <p>{`Enhancing synergy in modern productivity tool is a movement that will give rise to a platform shift where human and machines complement each other. `}</p>
                <p>{`Create applications in the office suite as if they were documents and apply AI to aid in actions like using excel-like formulas to import live data in apps or calling in external APIs.  `}</p>
              </SectionComment>
            </ContentWrapper>
          </ContentSection>

          <ContentSection fullpage style={{ backgroundImage: block3bg }}>
            <ContentWrapper verticalCenter verticalBottomMobile>
              <SectionWrapper>
                <SectionTitle ref={clip3}>Integrate everything</SectionTitle>
              </SectionWrapper>
              <SectionComment ref={noramlText3} sec3>
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
              <SectionWrapper>
                <SectionTitle ref={clip4} sec4>
                  All your data <br />
                  is under your control
                </SectionTitle>
              </SectionWrapper>
              <SectionComment ref={noramlText4} sec4>
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
              <SectionWrapper>
                <SectionTitle ref={clip5} sec4></SectionTitle>
              </SectionWrapper>
              <SectionComment ref={noramlText5} sec5>
                <p className="main">
                  <span className="mark begin">“</span>
                  {`A tool that can augment human intelligence should accumulate structured and unstructured information in a single place and have instruments to collaboratively create, mix, connect, visualize and retrieve information. `}
                  <span className="mark end">”</span>
                </p>
                <p>- By : Michael Dubakov</p>
              </SectionComment>
            </ContentWrapper>
          </ContentSection>
        </FullPageScrollContainer>

        <NormalScrollContainer
          style={{
            background: 'white',
            position: 'absolute',
            left: '0px',
            top: `${innerHeight * pageNum}px`,
            width: '100%'
          }}>
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
                  <div className="status-tag coming">Coming soon</div>
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
        </NormalScrollContainer>
      </MainContainer>
    </Page>
  )
}

export default Home
