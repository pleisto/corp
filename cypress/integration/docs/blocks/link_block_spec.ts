import { TEST_ID_ENUM } from '@brickdoc/test-helper'

describe('linkBlock', () => {
  beforeEach(() => {
    cy.sessionMock({ email: 'cypress@brickdoc.com' })
  })

  describe('external link', () => {
    it('embeds link by input link', () => {
      cy.visit('/')
      cy.addBlock('embed')
      cy.findByTestId(TEST_ID_ENUM.uploader.Dashboard.modules.link.input.id).focus().type('https://www.github.com')
      cy.findByTestId(TEST_ID_ENUM.uploader.Dashboard.modules.link.button.id).click()
      cy.findByTestId(TEST_ID_ENUM.editor.linkBlock.link.id).should('exist')
    })
  })
})
