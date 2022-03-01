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
    icon: null,
    collapsed: false,
    sort: 0,
    firstChildSort: 'a',
    children: [
      {
        key: 'mercury',
        value: 'mercury',
        title: 'Mercury',
        sort: 0,
        firstChildSort: 'a',
        icon: null
      },
      {
        key: 'venus',
        value: 'venus',
        title: 'Venus',
        sort: 1,
        firstChildSort: 'a',
        icon: null
      }
    ]
  }
]

const renderNode = (node: TNode) => {
  return <span>{node.title}</span>
}
const Template: ComponentStory<typeof Tree> = () => <Tree treeData={demoData} titleRender={renderNode} />

export const Basic = Template.bind({})
