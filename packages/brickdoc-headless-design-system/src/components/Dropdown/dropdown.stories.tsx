import { Dropdown } from './index'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Button, Menu } from '../'
import { overlayArgTypes } from '../Tooltip/overlay.docs'
import { omit } from 'lodash-es'
export default {
  title: 'Components/Dropdown',
  component: Dropdown,
  args: {
    placement: 'bottom-start',
    trigger: 'click',
    interactiveBorder: 2,
    removeOnHide: true
  },
  argTypes: {
    title: {
      description: '`ReactNode|undefined` The text shown in the popover'
    },
    content: {
      description: `\`ReactNode\` The content of the popover`
    },
    ...omit(overlayArgTypes, ['role', 'hasArrow'])
  },
  parameters: {
    docs: {
      description: {
        component: `
A dropdown list.

#### When To Use

When there are more than a few options to choose from, you can wrap them in a \`Dropdown\`.
By hovering or clicking on the trigger, a dropdown menu will appear, which allows you to
choose an option and execute the relevant action.
`
      }
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/YcVOEbdec2oqyKrYFSkeYW/Components-Base?node-id=4443%3A2286'
    }
  }
} as ComponentMeta<typeof Dropdown>

const Template: ComponentStory<typeof Dropdown> = args => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
    <Dropdown {...args} />
  </div>
)

export const Basic = Template.bind({})
Basic.args = {
  overlay: (
    <Menu>
      <Menu.Item key="one" label="One" onAction={() => console.log(123)}>
        Brickdoc
      </Menu.Item>
      <Menu.Item key="two">Two</Menu.Item>
      <Menu.Item key="three">Three</Menu.Item>
    </Menu>
  ),
  children: <Button>What does 42 mean?</Button>
}
