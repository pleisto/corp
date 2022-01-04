import { Tag } from './index'
import { TagGroup } from './tagGroup'

import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  title: 'Components/Tag',
  component: Tag,
  args: {
    type: 'line'
  },
  argTypes: {
    type: {
      options: ['line', 'card', 'editable-card'],
      control: {
        type: 'radio'
      }
    },
    hideAdd: {
      control: 'boolean'
    },
    centered: {
      control: 'boolean'
    },
    addIcon: {
      description: '`React.ReactNode`'
    },
    onEdit: {
      description: `(e: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => void`
    },
    className: {
      description: '`string`'
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
Tag component for feedback.

## When To Use

- Tag component is used to display a collection of concise information for rapid identification and grouping.

`
      }
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/YcVOEbdec2oqyKrYFSkeYW/Components-Base?node-id=697%3A2440'
    }
  }
} as ComponentMeta<typeof Tag>

const Template: ComponentStory<typeof Tag> = () => (
  <>
    <Tag>default</Tag>
    <Tag size="sm" closable={true}>
      test2
    </Tag>
    <Tag color="red">red</Tag>
    <Tag size="lg">test1</Tag>
    <Tag size="lg" border={false}>
      no-border
    </Tag>
  </>
)
export const Basic = Template.bind({})
Basic.args = {}

const TemplateGroup: ComponentStory<typeof TagGroup> = arg => (
  <>
    <TagGroup tagList={arg.tagList} size="lg" />
  </>
)

export const GroupTags = TemplateGroup.bind({})
TemplateGroup.args = {
  tagList: [{ children: 'doc' }, { children: 'test' }, { children: 'tag' }, { children: 'tags' }]
}
