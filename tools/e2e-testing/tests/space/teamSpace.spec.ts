import { test, expect } from '@/fixtures'
import { TeamSpacePage } from '@/pages/space/TeamSpacePage'

test.describe('teamSpace', () => {
  let teamSpace: TeamSpacePage

  test.beforeEach(async ({ page }) => {
    teamSpace = new TeamSpacePage(page)
    await page.goto('/', { waitUntil: 'networkidle' })
  })

  test('Verify InviteLinkReset', async ({ page }) => {
    await teamSpace.InviteLinkReset('newSpace')
    expect(teamSpace.getInviteLink()).toBeTruthy()
  })

  test('Verify space delete', async ({ page }) => {
    await teamSpace.deleteSpace('NSnewSpace', 'newSpace')
    expect(teamSpace.getMenu()).toBeTruthy()
  })
})
