export const MENUBAR_SELECTOR = {
  menu: '[aria-haspopup="menu"] > div > div.brd-c-exfbLA',
  menubarUnfold: '[aria-label="change"] svg',
  createSpace: 'text=Create New space',
  spaceNameInput: 'input[name="name"]',
  createBtn: 'button[type="submit"] > span',
  settingIcon: (spaceText: string) => `li[role="menuitem"]:has-text("${spaceText}") >> [aria-label="setting"]`
}

export const SECTION_SELECTOR = {
  menuSection: 'div [aria-haspopup="menu"]',
  menuItem: (spaceName: string) => `.brd-c-dmIGYm:has-text("${spaceName}")`,
  backToSpace: 'button[role="button"]:has-text("Back to Space")'
}

export const GENERAL_SELECTOR = {
  generalPage: 'a:has-text("General")',
  BioInput: 'textarea[name="bio"]',
  avatarEditor: 'text=Upload Photo >> button[role="button"]',
  uploadBtn: '[data-testid="uploader-dashboard-modules-upload-button"]',
  updateProfileBtn: 'button[role="button"]:has-text("Update Profile")',
  domainNameInput: 'input[name="new_domain"]',
  updateBtn: 'text=Change Domain Name >> button[role="button"]',
  timezone: 'text=Timezoneutc >> input[role="combobox"]',
  timezoneSelect: (timezone: string, index: number) => `text=${timezone} >> nth=${index}`,
  language: 'text=LanguageEnglish >> input[role="combobox"]',
  languageSelect: (language: string) => `text=${language}`,
  saveAppearanceBtn: 'button[role="button"]:has-text("Save Appearance")'
}

export const TEAM_SPACE_SELECTOR = {
  teamSpacePage: 'nav >> text=Team Space',
  enableInviteBtn: '.brd-c-kHLHuS',
  inviteLink: 'input[type="text"]',
  resetBtn: 'button[role="button"]:has-text("Reset")',
  resetConfirm: 'button[role="button"]:has-text("Confirm")',
  deleteBtn: 'button[role="button"]:has-text("Delete This Team Space")',
  deleteInput: 'div[role="presentation"] input[type="text"]',
  deleteConfirm: 'button[role="button"]:has-text("Delete Space")'
}
