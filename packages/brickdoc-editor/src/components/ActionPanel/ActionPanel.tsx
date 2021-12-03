import React from 'react'
import cx from 'classnames'
import { Button, Dropdown, Menu, Popover } from '@brickdoc/design-system'
import './ActionPanel.less'

export interface ActionDropdownMenuItem {
  type: 'item'
  onClick?: () => void
  Icon: React.ReactElement
  name: string
}

export interface ActionDropdownMenuDivider {
  type: 'divider'
}

export interface ActionOptionBase {
  type: 'button' | 'dropdown'
  active?: boolean
  Icon: React.ReactElement
  onClick?: () => void
}

export interface ActionButtonOption extends ActionOptionBase {
  type: 'button'
}

export interface ActionDropdownOption extends ActionOptionBase {
  type: 'dropdown'
  menuItems: Array<ActionDropdownMenuItem | ActionDropdownMenuDivider>
}

export type ActionOption = ActionButtonOption | ActionDropdownOption

export type ActionOptionGroup = Array<ActionOption[] | ActionOption>

export interface ActionPanelProps {
  options: ActionOptionGroup
}

const renderOptionButton = (option: ActionOption): React.ReactElement => (
  <Button onClick={option.onClick} className={cx('brickdoc-action-panel-button', { active: option.active })} type="text">
    {option.Icon}
  </Button>
)

const renderOptionDropdown = (option: ActionDropdownOption): React.ReactElement => (
  <Dropdown
    overlay={
      <Menu className="brickdoc-action-panel-dropdown-menu">
        {option.menuItems.map((item, index) => {
          if (item.type === 'item') {
            return (
              <Menu.Item onClick={item.onClick} className="brickdoc-action-panel-dropdown-menu-item" key={item.name}>
                {React.cloneElement(item.Icon, { className: 'brickdoc-action-panel-dropdown-menu-item-icon' })}
                {item.name}
              </Menu.Item>
            )
          } else {
            return <Menu.Divider key={index} className="brickdoc-action-panel-dropdown-menu-divider" />
          }
        })}
      </Menu>
    }>
    {renderOptionButton(option)}
  </Dropdown>
)

const renderOption = (option: ActionOption): React.ReactElement => {
  if (option.type === 'button') {
    return renderOptionButton(option)
  }

  return renderOptionDropdown(option)
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ options, children }) => {
  const panel = (
    <div className="brickdoc-action-panel">
      {options.reduce<React.ReactElement[]>((elements, option, index) => {
        if (Array.isArray(option))
          return [
            ...elements,
            ...option.map(option => renderOption(option)),
            <div key={`divider${index}`} className="brickdoc--action-panel-divider" />
          ]
        return [...elements, renderOption(option)]
      }, [])}
    </div>
  )
  // const [t] = useEditorI18n()
  // const panel = (
  //   <div className="brickdoc-link-block-action-panel">
  //     {onFullScreen && (
  //       <Button onClick={onFullScreen} className="brickdoc-link-block-action-button" type="text">
  //         <Icon.ScreenFull />
  //       </Button>
  //     )}
  //     <Button onClick={onDownload} className="brickdoc-link-block-action-button" type="text">
  //       <Icon.Download />
  //     </Button>
  //     <div className="brickdoc-link-block-action-button-divider" />
  //     <Button onClick={onToggleMode} className={cx('brickdoc-link-block-action-button', { active: mode === 'link' })} type="text">
  //       <Icon.TextView />
  //     </Button>
  //     <Button onClick={onToggleMode} className={cx('brickdoc-link-block-action-button', { active: mode === 'preview' })} type="text">
  //       <Icon.Preview />
  //     </Button>
  //     <div className="brickdoc-link-block-action-button-divider" />
  //     <Dropdown
  //       overlay={
  //         <Menu className="brickdoc-link-block-more-action-menu">
  //           {/* <Menu.Item onClick={onDuplicate} className="brickdoc-link-block-more-action-menu-item" key="duplicate">
  //               <Icon.Copy className="brickdoc-link-block-more-action-menu-item-icon" />
  //               {t('link_block.menu.more.duplicate')}
  //             </Menu.Item> */}
  //           <Menu.Item onClick={onCopyLink} className="brickdoc-link-block-more-action-menu-item" key="copy link">
  //             <Icon.Link className="brickdoc-link-block-more-action-menu-item-icon" />
  //             {t('link_block.menu.more.copy')}
  //           </Menu.Item>
  //           <Menu.Divider className="brickdoc-link-block-more-action-menu-divider" />
  //           <Menu.Item onClick={onDelete} className="brickdoc-link-block-more-action-menu-item" key="delete">
  //             <Icon.Delete className="brickdoc-link-block-more-action-menu-item-icon" />
  //             {t('link_block.menu.more.delete')}
  //           </Menu.Item>
  //         </Menu>
  //       }>
  //       <Button className="brickdoc-link-block-action-button" type="text">
  //         <Icon.More />
  //       </Button>
  //     </Dropdown>
  //   </div>
  // )

  return (
    <Popover overlayClassName="brickdoc-action-panel-popover" trigger="hover" placement="top" content={panel}>
      {children}
    </Popover>
  )
}
