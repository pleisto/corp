import Image from 'next/image'
import { Button } from '@brickdoc/design-system'
import bg from '@/public/images/lg1.png'
import sm from '@/public/images/sm1.png'
import * as Root from './style/item.style'

export const ItemCooperation = () => {
  return (
    <Root.ItemCard color="green" direcTion="ltr">
      <Root.Title
        css={{
          marginTop: 40
        }}
      >
        <h1>Cooperation</h1>
        <h2>Let &quot;silicon people&quot; use cool, let &quot;carbon people&quot; use cool</h2>
        <p>
          CRDT algorithm is used to achieve efficient collaborative editing, even if
          <br />
          real-time collaborative editing between people can also enjoy the silk slip.
        </p>
        <Button type="secondary">Coming soon ...</Button>
      </Root.Title>
      <Root.Content
        css={{
          marginTop: -27
        }}
      >
        <Image src={bg} alt="Cooperation" />
      </Root.Content>
      <Root.ContentSm>
        <Image src={sm} alt="Cooperation" />
      </Root.ContentSm>
    </Root.ItemCard>
  )
}
