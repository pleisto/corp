export enum ActionType {
  Cancel,
  'Delete Page',
  'Create'
}

export const COMMON_SELECTORS = {
  tooltip: '[role="tooltip"]',
  menubarItems: '[role="menubar"] li[role=menuitem]',
  dialog: {
    component: 'div[role=presentation]',
    actionButton: (action: ActionType) => `div[role=presentation] button:has-text("${action}")`
  }
}
