export const TEAM_SPACE_SELECTOR = {
  inviteMember: {
    switch: 'div[data-testid=component-switch]',
    input: 'div[data-testid=space-teamSpace-inviteInput] input',
    reset: 'button[data-testid=space-teamSpace-reset]'
  },
  members: {
    leave: (index: number) => `button:has-text("Leave") >> nth=${index}`
  },
  deleteSpace: {
    button: 'button:has-text("Delete This Team Space")'
  }
}
