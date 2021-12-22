import { Popover } from './index'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Button } from '../'
import { overlayArgTypes } from '../Tooltip/overlay.docs'
export default {
  title: 'Components/Popover',
  component: Popover,
  args: {
    placement: 'top',
    trigger: 'click',
    role: 'dialog',
    interactiveBorder: 2,
    hasArrow: true,
    removeOnHide: true
  },
  argTypes: {
    title: {
      description: '`ReactNode|undefined` The text shown in the popover'
    },
    content: {
      description: `\`ReactNode\` The content of the popover`
    },
    ...overlayArgTypes
  },
  parameters: {
    docs: {
      description: {
        component: `
The floating card popped by clicking or hovering.

#### When To Use

- A simple popup menu to provide extra information or operations.

- Comparing with popover, besides information Popover card can also provide action elements like links and buttons.

#### Notes

** We use \`Press\` event instead of \`Click\` event ** to improve the accessibility. If you want use custom
component as click trigger, you might need \`import { usePress } from '@brickdoc/design-system' \`.
See [React Aria Docs](https://react-spectrum.adobe.com/react-aria/usePress.html) for more information.

`
      }
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/YcVOEbdec2oqyKrYFSkeYW/Components-Base?node-id=4443%3A2288'
    }
  }
} as ComponentMeta<typeof Popover>

const Template: ComponentStory<typeof Popover> = args => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
    <Popover {...args} />
  </div>
)

export const Basic = Template.bind({})
Basic.args = {
  title: 'Answer',
  content: <p>42 is the meaning of life</p>,
  children: <Button>What does 42 mean?</Button>
}

export const ContextMenu = Template.bind({})
ContextMenu.args = {
  title: 'Answer',
  content: <p>42 is the meaning of life</p>,
  trigger: 'contextmenu',
  children: (
    <div
      style={{
        height: '4rem',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#efefef'
      }}>
      Right Click on Here
    </div>
  )
}
