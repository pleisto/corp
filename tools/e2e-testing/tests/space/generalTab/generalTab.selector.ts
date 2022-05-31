export const GENERAL_TAB_SELECTOR = {
  title: 'main .container div h2',
  profile: {
    nameInput: 'div[data-testid=space-profile-nameInput] input',
    bioInput: 'textarea[data-testid=space-profile-bioInput]',
    updateButton: 'button[data-testid=space-profile-updateButton]',
    avatar: {
      editAvatar: 'button[data-testid=space-profile-avatarUpdate]',
      avatarImg: '#sdfsdf img',
      dialogTab: '.uploader-dashboard-navbar',
      uploadButton: '.uploader-dashboard-upload-panel .dashboard-upload-file-input'
    }
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
