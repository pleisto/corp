import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Button } from '../'
import { Tooltip } from '.'
import { TIPPY_ARG_TYPES } from './tippy/tippy.docs'
export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: {
    title: '42 is the meaning of life.',
    children: <Button>What does 42 mean?</Button>
  },
  argTypes: {
    title: {
      description: 'The text shown in the tooltip',
      control: {
        type: 'text'
      }
    },
    ...TIPPY_ARG_TYPES
  },
  parameters: {
    docs: {
      description: {
        component: `
A simple text popup tip.

#### When To Use

- The tip is shown on mouse enter, and is hidden on mouse leave. The Tooltip doesn't support complex text or operations.

- To provide an explanation of a button/text/operation. It's often used instead of the html title attribute.

#### Note

For props other than \`title\` and \`children\`, you can find more details in [Tippy.js documentation](https://atomiks.github.io/tippyjs/v6/all-props).
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
    }}
  >
    <Tooltip {...args} />
  </div>
)

export const Basic = Template.bind({})
