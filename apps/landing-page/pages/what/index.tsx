import type { NextPage } from 'next'
import Image from 'next/image'
import { Footer, Layout, Nav, Video } from '@/components/Layout'
import mp4Url from '@/public/t1.mp4'
import CloudUrl from '@/public/images/cloud.png'
import W3cUrl from '@/public/images/w3c.png'
import TwitterUrl from '@/public/images/twitter.png'
import TsUrl from '@/public/images/ts.png'
import RubyUrl from '@/public/images/ruby.png'
import PinterestUrl from '@/public/images/pinterest.png'
import GithubUrl from '@/public/images/github.png'
import GoogleUrl from '@/public/images/google.png'
import * as RootHead from './style/head.style'
import * as RootBody from './style/body.style'

const WhatPage: NextPage = () => {
  return (
    <>
      <Video url={mp4Url} />
      <Layout>
        <Nav />
        <RootHead.Head>
          <RootHead.Title>Experiment Your Thoughts With Every Bricks of Doc</RootHead.Title>
          <RootHead.Des>
            BrickDoc is on a mission to save humanity by powering ‘superminds’ to augment intellectual capabilities for
            real-world problem solvers.
          </RootHead.Des>
        </RootHead.Head>

        <RootBody.Gallery>
          <RootBody.GalleryHead>
            Trusted by teams at over 200,000 of the world’s leading organizations
          </RootBody.GalleryHead>
          <RootBody.GalleryBody>
            <Image src={W3cUrl} alt="w3c" />
            <Image src={TsUrl} alt="typescript" />
            <Image src={CloudUrl} alt="cloud" />
            <Image src={RubyUrl} alt="ruby" />
            <Image src={GoogleUrl} alt="google" />
            <Image src={TwitterUrl} alt="twitter" />
            <Image src={GithubUrl} alt="github" />
            <Image src={PinterestUrl} alt="pinterest" />
          </RootBody.GalleryBody>
        </RootBody.Gallery>

        <RootBody.Body>
          <p>
            Just as how electricity transformed every major industry about 100 years ago, customizable all-in-one
            productivity platforms are the new electricity that will revolutionize the future of work.
          </p>
          <p>
            And, productivity is optimized when humans and machines function collaboratively in a designed system to
            respectively complement and counterbalance each other’s strengths and weaknesses.
          </p>
          <p>
            In the study of collective intelligence, such hybrid human-machine systems are referred to as ‘superminds’.
          </p>
          <p>
            The superminds view is that computers are here to augment the human intellect and enable a level up in our
            capabilities to solve more complex problems.
          </p>
          <p>
            This is a contrast from the ‘substitute’ mentality where digital transformation is assumed to be a zero-sum
            game.
          </p>
          <p>
            BrickDoc is on a mission to save humanity by powering ‘superminds’ to augment intellectual capabilities for
            real-world problem solvers.
          </p>
          <p>
            We are not simply building a productivity platform that automates work and supports collaboration between
            users but takes a step further to nurture human-machine interactions and amplify collective intelligence.
          </p>
          <p>The BrickDoc team is designing a better future for work — one brick at a time.</p>
        </RootBody.Body>
      </Layout>
      <Footer />
    </>
  )
}

export default WhatPage
