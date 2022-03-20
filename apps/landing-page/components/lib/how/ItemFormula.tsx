import Image from 'next/image'
import { Button } from '@brickdoc/design-system'
import bg from '@/public/images/lg2.png'
import sm from '@/public/images/sm2.png'
import * as Root from './style/item.style'

export const ItemFormula = () => {
  return (
    <Root.ItemCard color="blue" direcTion="rtl">
      <Root.Content
        css={{
          marginTop: -28
        }}
      >
        <Image src={bg} alt="Formula" />
      </Root.Content>
      <Root.Title
        css={{
          marginTop: 56
        }}
      >
        <h1>Formula</h1>
        <h2>Blocks can contain arbitrary data, just as atoms shape everything</h2>
        <p>
          Brickdoc, in effect, breaks down the
          <br />
          distinction between &quot;documents&quot; and &quot;web pages&quot; and
          <br />
          even &quot;software&quot;.
        </p>
        <Button type="secondary">Explore our cases</Button>
      </Root.Title>
      <Root.ContentSm>
        <Image src={sm} alt="Formula" />
      </Root.ContentSm>
    </Root.ItemCard>
  )
}
