import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TNode, Tree } from '.'

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
    isOpen: true,
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
            key: 'luna',
            value: 'luna',
            title: 'Luna (the Moon)'
          }
        ]
      }
    ]
  }
]

const renderNode = (node: TNode) => {
  return <span>{node.title}</span>
}
const Template: ComponentStory<typeof Tree> = () => <Tree treeData={demoData} titleRender={renderNode} />

export const Basic = Template.bind({})
