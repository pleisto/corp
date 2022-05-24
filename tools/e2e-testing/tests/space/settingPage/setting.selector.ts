export const MENUBAR_SELECTOR = {
  menu: 'div [aria-haspopup="menu"]',
  menubarUnfold: '[aria-label="change"] svg',
  menuItem: (spaceName: string) => `[role="menubar"] li:has-text("${spaceName}")`,
  settingIcon: (spaceText: string) => `li[role="menuitem"]:has-text("${spaceText}") >> [aria-label="setting"]`
}
