export const GENERAL_TAB_SELECTOR = {
  title: 'main .container div h2',
  profile: {
    nameInput: 'div[data-testid=space-profile-nameInput] input',
    bioInput: 'textarea[data-testid=space-profile-bioInput]',
    updateButton: 'button[data-testid=space-profile-updateButton]',
    editAvatar: 'button[data-testid=space-profile-avatarUpdate]'
  },
  domain: {
    input: 'div[data-testid=space-domain-input] input',
    learnMore: 'a:has-text("Learn More")',
    updateButton: 'button[data-testid=space-domain-updateButton]'
  },
  display: {
    timezone: 'div[name=timezone] input',
    language: 'div[name=locale] input',
    saveButton: 'button[data-testid=space-display-saveButton]'
  }
}
