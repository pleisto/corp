export enum SpaceSettingTab {
  General,
  Account,
  'Team Space'
}

export const SPACE_SIDEBAR_SELECTOR = {
  openMenuButton: 'header span[role="img"].brd-icon-change',
  currentSpaceName: 'header span[data-testid=space-name]',
  backToSpaceButton: 'footer button:has-text("Back to Space")',
  settingTab: (tab: SpaceSettingTab) => `section nav a:has-text("${tab}")`
}
