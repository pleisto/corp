import Image from 'next/image'
import { Button } from '@brickdoc/design-system'
import bg from '@/public/images/lg3.png'
import * as Root from './style/item.style'

export const ItemWorkflow = () => {
  return (
    <Root.ItemCard color="cyan" direcTion="ltr">
      <Root.Title
        css={{
          marginTop: 6
        }}
      >
        <h1>Workflow</h1>
        <h2>It&apos;s not just people you can edit with, it&apos;s robots</h2>
        <p>
          When a robot can edit the same
          <br />
          document as you, your individual
          <br />
          productivity will be greatly
          <br />
          improved.Brickdoc can automatically
          <br />
          send pin notifications, create Zoom
          <br />
          meetings, create customer service
          <br />
          worksheets and more if you need to.
        </p>
        <Button type="secondary">Explore our cases</Button>
      </Root.Title>
      <Root.Content
        css={{
          marginTop: -63
        }}
      >
        <Image src={bg} alt="Explore our cases" />
      </Root.Content>
    </Root.ItemCard>
  )
}
