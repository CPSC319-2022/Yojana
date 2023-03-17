describe('Login', () => {
  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
    })

    it('should show the create button in the sidebar', () => {
      cy.get('button#create-category-btn').should('exist')
    })
  })

  describe('pleb', () => {
    beforeEach(() => {
      cy.login('pleb')
      cy.visit('/')
    })

    it('should show the create button in the sidebar', () => {
      cy.get('button#create-category-btn').should('exist')
    })
  })
})

export {}
