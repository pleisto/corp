import Image from 'next/image'
import { Button } from '@brickdoc/design-system'
import bg from '@/public/images/lg4.png'
import * as Root from './style/item.style'

export const ItemExtension = () => {
  return (
    <Root.ItemCard color="orange" direcTion="rtl">
      <Root.Content
        css={{
          marginTop: -62
        }}
      >
        <Image src={bg} alt="Extension Store" />
      </Root.Content>
      <Root.Title
        css={{
          marginTop: 52
        }}
      >
        <h1>Extension Store</h1>
        <h2>The Extension store is also a template store.</h2>
        <p>
          You can use the amazing building
          <br />
          blocks built by Brickdoc and the
          <br />
          Brickdoc ecosystem developers through
          <br />
          the Plugin Store.
        </p>
        <Button type="secondary">Coming soon...</Button>
      </Root.Title>
    </Root.ItemCard>
  )
}
