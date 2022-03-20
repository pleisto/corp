import { Footer, Layout, Nav, Video } from '@/components/Layout'
import mp4Url from '@/public/t2.mp4'
import * as RootHead from '@/components/lib/what/style/head.style'
import * as RootBody from '@/components/lib/what/style/body.style'

export const Why = () => {
  return (
    <>
      <Video url={mp4Url} />
      <Layout>
        <Nav />
        <RootHead.Head>
          <RootHead.Title css={{ justifyContent: 'center' }}>Why</RootHead.Title>
          <RootHead.Des>
            Brickdoc aims to help you maximize your productivity at work, study and life through &quot;human-computer
            collaboration&quot;.
          </RootHead.Des>
        </RootHead.Head>

        <RootBody.Body>
          <p>
            Brickdoc is a next-generation online Office system designed around the concept of &quot;Intelligence
            Augmented J&quot;. Just as you can build thousands of things out of blocks, you can use Brickdoc to write,
            build a second brain, build a team knowledge base, build simple databases, and even perform many tasks that
            traditionally require you to be able to write code efficiently.
          </p>
          <h3>It&apos;s not just people you can edit with, it&apos;s robots</h3>
          <p>
            Human beings have been looking for ways to express their thoughts and feelings with visual symbols, ways to
            store their memories and knowledge with graphics, and ways to simplify and routinize information
            transmission. The creation of the written word, the development of printing, the invention of the camera,
            the spread of the Internet, all represent this effort. The alternating growth of thought and technology
            still represents a continuation of this exploration to this day. -- &quot;World Modern Design History&quot;
            Wang Shouzhi
          </p>
          <p>
            Supporting multiple users and multiple devices to edit the same online document at the same time can greatly
            improve team efficiency. And when a robot can edit the same document as you, your individual productivity
            will be greatly improved
          </p>
          <h3>Open source under the Apache 2.0 protocol, we build a better world by building &quot;network effects.</h3>
          <p>
            Signing up for an AWS account and installing in the AWS Marketplace with one click is all it takes to
            privately deploy Brickdoc on the cloud. Just pay AWS the necessary fees to run the server, and the rest is
            as smooth as SaaS.
          </p>
          <h3>Let API vendors go directly to end users</h3>
          <p>
            From sliced text (OCR) to typos and syntax checking, there are enough API vendors that provide powerful
            enough apis to solve these technical challenges. Awkwardly, however, this still requires the ability to
            write a small script of timely code to call an API. Brickdoc allows end users to use these apis as easily as
            Excel functions.
          </p>
        </RootBody.Body>
      </Layout>
      <Footer />
    </>
  )
}
