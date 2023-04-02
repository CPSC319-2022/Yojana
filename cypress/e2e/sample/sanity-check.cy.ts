// Sanity check to make sure the test suite is working
describe('Sanity Check', () => {
  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
    })

    it('should show the yojana title', () => {
      cy.get('h1#yojana-title').should('be.visible')
    })
  })

  describe('pleb', () => {
    beforeEach(() => {
      cy.login('pleb')
      cy.visit('/')
    })

    it('should show the yojana title', () => {
      cy.get('h1#yojana-title').should('be.visible')
    })
  })
})

export {}
