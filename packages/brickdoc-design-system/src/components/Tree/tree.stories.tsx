import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ReactNode } from 'react'
import { styled } from '../../themes'
import { TNode, Tree } from '.'

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

export default {
  title: 'Components/Tree',
  component: Tree,
  args: {
    height: 300,
    draggable: false,
    treeData: demoData
  },
  argTypes: {
    height: {
      control: 'number',
      description: `Optionally specify the height of the tree.
If not specified, it'll fit automatically with a maximum value.`
    },
    expandAll: { control: 'boolean', description: 'Whether to expand all nodes on load.' },
    expandOnSelect: { control: 'boolean', description: `Whether to expand a node when it's selected by user.` },
    initialSelectedId: {
      control: 'text',
      description: `If specified, the node with the given value will be selected on load.`
    },
    draggable: {
      control: 'boolean',
      description: `Whether allow the user drag and drop tree node.
If \`true\`, \`onDrop\` will be callded when a node is dropped.`
    },
    onDrop: { description: `A callback that will be called when the user drops a node.` },
    className: { description: 'the CSS class applied to the tree.' },
    treeNodeClassName: { description: 'the CSS class applied to the tree node.' },
    renderNode: {
      description: `A renderer callback to specify how the data should be rendered into a tree node component.
If not specified, it'll render plain text.`,
      control: null
    },
    emptyNode: {
      description: `How an empty tree node should be rendered.`
    }
  },
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

const Template: ComponentStory<typeof Tree> = args => <Tree {...args} />

export const Basic = Template.bind({})

export const ExpandInitialSelection = Template.bind({})
ExpandInitialSelection.args = {
  initialSelectedId: 'earth'
}

export const ExpandOnSelect = Template.bind({})
ExpandOnSelect.args = {
  expandOnSelect: true
}

export const ExpandAllOnLoad = Template.bind({})
ExpandAllOnLoad.args = {
  expandAll: true
}

const renderNode = (node: TNode): ReactNode => {
  return <StyledNode>{node.title}</StyledNode>
}
const StyledNode = styled('div', {
  fontSize: '.75rem',
  padding: '0 1em',
  backgroundColor: 'orange',
  border: '1px solid black',
  borderRadius: '1em',
  height: '100%',
  width: 'fit-content'
})
export const RenderCustomNode = Template.bind({})
RenderCustomNode.args = {
  titleRender: renderNode
}
