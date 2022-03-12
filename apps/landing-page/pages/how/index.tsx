import type { NextPage } from 'next'
import { Footer, Layout, Nav, Video } from '@/components/Layout'
import { ItemCooperation } from './ItemCooperation'
import { ItemFormula } from './ItemFormula'
import { ItemWorkflow } from './ItemWorkflow'
import { ItemExtension } from './ItemExtension'
import mp4Url from '@/public/t3.mp4'
import * as RootHead from '@/pages/what/style/head.style'
import * as RootBody from '@/pages/what/style/body.style'

const HowPage: NextPage = () => {
  return (
    <>
      <Video url={mp4Url} />
      <Layout>
        <Nav />
        <RootHead.Head>
          <RootHead.Title css={{ justifyContent: 'center' }}>How</RootHead.Title>
          <RootHead.Des>
            &quot;Folders&quot; and &quot;files&quot; mean everything in traditional office software, and even the
            various
            <br />
            templates that are supposed to be &quot;out of the box&quot; are essentially placeholder filled skeleton
            <br />
            files waiting to be filled with data. In Brickdoc, &quot;blocks&quot; make up everything.
          </RootHead.Des>
        </RootHead.Head>

        <RootBody.Body>
          <p>
            Brickdoc is a next-generation online Office system designed around the concept of &quot;Intelligence
            Augmented J&quot;. Just as you can build thousands of things out of blocks, you can use Brickdoc to write,
            build a second brain, build a team knowledge base, build simple databases, and even perform many tasks that
            traditionally require you to be able to write code efficiently.
          </p>
          <h4>
            All in all, Brickdoc aims to help you maximize your productivity at work, study and life through
            &quot;human-computer collaboration&quot;.
          </h4>

          <ItemCooperation />
          <ItemFormula />
          <ItemWorkflow />
          <ItemExtension />
        </RootBody.Body>
      </Layout>
      <Footer />
    </>
  )
}

export default HowPage
