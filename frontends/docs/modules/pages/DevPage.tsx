import React from 'react'
import { Button, Icon, Menu, Dropdown } from '@brickdoc/design-system'

export const DevPage: React.FC = () => {
  const menu = (
    <Menu>
      <Menu.Item key="1">1st item</Menu.Item>
      <Menu.Item key="2">2nd item</Menu.Item>
      <Menu.Item key="3">3rd item</Menu.Item>
    </Menu>
  )

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dev Page</h1>
      <br />
      <br />
      <h2>Button</h2>
      <Dropdown.Button overlay={menu} type="primary">
        Actions
      </Dropdown.Button>
      <Button size="small">Default</Button>
      &nbsp;
      <Button>Default</Button>
      &nbsp;
      <Button size="large">Default</Button>
      <br />
      <br />
      <Button type="primary" icon={<Icon.Delete />}>
        Primary{' '}
      </Button>
      <br />
      <br />
      <Button type="text">Text Button</Button>
      <br />
      <br />
      <Button type="link">Link Button</Button>
      <br />
      <br />
      <Button type="primary" shape="circle">
        A
      </Button>
      &nbsp;
      <Button shape="circle" icon={<Icon.Instagram />} />
      <br />
      <br />
      <Button type="primary" disabled>
        Primary{' '}
      </Button>
      <Button disabled>DD </Button>
      <Button shape="circle" disabled>
        D
      </Button>
      <br />
      <br />
      <Button type="primary" loading>
        Loading
      </Button>
    </div>
  )
}
