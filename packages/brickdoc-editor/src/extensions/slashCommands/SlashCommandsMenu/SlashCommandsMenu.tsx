import * as React from 'react'
import { Editor, Range } from '@tiptap/react'
import { SlashMenuItem } from './SlashMenuItem'
import './index.less'

export interface SlashCommandsMenuItem {
  title: string
  desc: string
  icon: React.ReactNode
  command: ({ editor, range }: { editor: Editor; range: Range }) => void
}

export interface SlashCommandsMenuProps {
  items: SlashCommandsMenuItem[]
  activeIndex?: number
  onIndexChange?: (index: number) => void
  command: (item: SlashCommandsMenuItem) => void
}

// We need expose instance function onKeyDown for suggestion extension.
// And reactRenderer only access ref of a class component, thus SlashCommandsMenu must be a class component.
export class SlashCommandsMenu extends React.PureComponent<SlashCommandsMenuProps> {
  container: HTMLDivElement | undefined

  selectItem = (index: number) => () => {
    const item = this.props.items[index]
    if (item) {
      this.props.command(item)
    }
  }

  onHover = (index: number) => (): void => {
    this.props.onIndexChange?.(index)
  }

  render(): React.ReactElement {
    const { items, activeIndex } = this.props

    return (
      <div role="menu" className="brickdoc-slash-menu">
        <div className="slash-menu-heading">Brickdoc</div>
        {items.map((item, index) => (
          <SlashMenuItem
            key={index}
            active={index === activeIndex}
            title={item.title}
            desc={item.desc}
            icon={item.icon}
            onClick={this.selectItem(index)}
            onHover={this.onHover(index)}
          />
        ))}
      </div>
    )
  }
}
