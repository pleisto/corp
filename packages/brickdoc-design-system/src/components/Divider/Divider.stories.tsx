import { Story } from '@storybook/react'
import { Divider } from '.'

export default {
  title: 'Components/Divider',
  component: Divider,
  parameters: {
    docs: {
      description: {
        component: `
A divider line that can be used to separate content.
`
      }
    }
  }
}

export const Basic: Story = () => (
  <div>
    <Divider />
    <Divider>With Text</Divider>
  </div>
)
