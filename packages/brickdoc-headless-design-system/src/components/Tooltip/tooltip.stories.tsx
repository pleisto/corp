import { FC, useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Tooltip } from './index'
import { Button, Switch } from '../'
import { overlayArgTypes } from './overlay.docs'
export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: {
    placement: 'top',
    delay: 300,
    trigger: 'mouseenter focus',
    role: 'tooltip',
    touch: ['hold', 1000],
    interactiveBorder: 2,
    hasArrow: true,
    removeOnHide: true
  },
  argTypes: {
    ...overlayArgTypes,
    title: {
      description: '`ReactNode` The text shown in the tooltip',
      control: {
        type: 'text'
      }
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
A simple text popup tip.

#### When To Use

- The tip is shown on mouse enter, and is hidden on mouse leave. The Tooltip doesn't support complex text or operations.

- To provide an explanation of a button/text/operation. It's often used instead of the html title attribute.
`
      }
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/YcVOEbdec2oqyKrYFSkeYW/Components-Base?node-id=4443%3A2288'
    }
  }
} as ComponentMeta<typeof Tooltip>

const Template: ComponentStory<typeof Tooltip> = args => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
    <Tooltip {...args} />
  </div>
)

export const Basic = Template.bind({})
Basic.args = { title: '42 is the meaning of life', children: <Button>What does 42 mean?</Button> }

export const ControlledMode: FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  return (
    <div>
      <Switch onChange={visible => setIsVisible(visible)}>Tooltip Visible</Switch>
      <br />
      <br />
      <Tooltip title="It's work" isVisible={isVisible}>
        <div
          style={{
            textAlign: 'center',
            border: '1px solid #ccc',
            paddingTop: '1rem'
          }}
          role="button"
          tabIndex={0}>
          <h4>This is children</h4>
          <p>
            If you are using a un-focusable element like there, ensure you add <code>tabindex="0"</code> so that it can
            receive focus.
          </p>
        </div>
      </Tooltip>
    </div>
  )
}
