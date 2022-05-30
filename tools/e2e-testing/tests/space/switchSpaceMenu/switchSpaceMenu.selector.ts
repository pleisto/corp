export const SWITCH_SPACE_MENU_SELECTOR = {
  openMenuButton: 'header span[role="img"].brd-icon-change',
  currentSpaceName: 'header span[data-testid=space-name]',
  spaceName: (name: string) => `span[data-testid=space-name]:has-text("${name}")`,
  createSpace: 'li[role=menuitem] text=Create New space',
  spaceNameInput: 'input[name="name"]',
  logOutButton: 'li[role=menuitem] text=Log out',
  settingSpace: (index: number) => `.action-setting >> nth=${index}`
}
