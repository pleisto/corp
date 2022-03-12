import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ReactNode } from 'react'
import { TNode, Tree, TreeProps } from '.'

export default {
  title: 'Components/Tree',
  component: Tree,
  parameters: {
    docs: {
      description: {
        component: `
## Todo: Component description
`
      },
      design: {
        type: 'figma',
        url: 'https://www.figma.com/file/YcVOEbdec2oqyKrYFSkeYW/Components-Base?node-id=1381%3A4856'
      }
    }
  }
} as ComponentMeta<typeof Tree>

const demoData: TNode[] = [
  {
    key: 'sun',
    value: 'sun',
    title: 'Sun',
    icon: '🔆',
    isExpanded: true,
    children: [
      {
        key: 'mercury',
        value: 'mercury',
        title: 'Mercury'
      },
      {
        key: 'venus',
        value: 'venus',
        title: 'Venus'
      },
      {
        key: 'earth',
        value: 'earth',
        title: 'Earth',
        children: [
          {
            key: 'moon',
            value: 'moon',
            title: 'The Moon'
          }
        ]
      },
      {
        key: 'mars',
        value: 'mars',
        title: 'Mars',
        children: [
          {
            key: 'deimos',
            value: 'deimos',
            title: 'Deimos'
          },
          {
            key: 'phobos',
            value: 'phobos',
            title: 'Phobos'
          }
        ]
      }
    ]
  }
]

const renderNode = (node: TNode): ReactNode => {
  return <span>{node.title}</span>
}
type ArgsType = Omit<TreeProps, 'treeData' | 'onDrop' | 'titleRender'>
const Template: ComponentStory<typeof Tree> = (args: ArgsType) => (
  <Tree treeData={demoData} titleRender={renderNode} {...args} />
)

export const Basic = Template.bind({})

export const ExpandInitialSelection = Template.bind({})
ExpandInitialSelection.args = {
  selectedNodeId: 'earth'
}

export const ExpandOnSelect = Template.bind({})
ExpandOnSelect.args = {
  expandOnSelect: true
}
