import { Spinner } from './index'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  title: 'Components/Spinner',
  component: Spinner,
  args: {
    type: 'primary'
  },
  argTypes: {
    emptyColor: {
      control: 'text',
      description: 'The color of the empty area in the spinner'
    },
    label: {
      control: 'text',
      description: 'aria-label'
    },
    size: {
      control: {
        type: 'radio'
      },
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    color: {
      description: 'color token. default is `primaryDefault`'
    },
    speed: {
      description: 'The speed of the spinner. example value: 0.2s'
    },
    thickness: {
      description: 'The thickness of the spinner. example value: 4px'
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
Spinners provide a visual cue that an action is either processing, awaiting a course of change or a result.
`
      }
    }
  }
} as ComponentMeta<typeof Spinner>

const Template: ComponentStory<typeof Spinner> = args => <Spinner {...args} />
export const Basic = Template.bind({})
