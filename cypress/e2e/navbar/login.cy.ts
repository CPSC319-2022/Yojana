describe('Login', () => {
  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
    })

    it('should show the create button in the sidebar', () => {
      cy.get('button#create-category-btn').should('exist')
    })

    it('should show CategoriesDropdown on hover', () => {
      cy.get('button#category-dropdown-1').should('not.exist')
      cy.get('div#category-item-1').trigger('mouseover')
      cy.get('button#category-dropdown-1').should('not.exist')
    })
  })

  describe('pleb', () => {
    beforeEach(() => {
      cy.login('pleb')
      cy.visit('/')
    })

    it('should not show the create button in the sidebar', () => {
      cy.get('button#create-category-btn').should('not.exist')
    })

    it('should show CategoriesDropdown on hover', () => {
      cy.get('button#category-dropdown-1').should('not.exist')
      cy.get('div#category-item-1').trigger('mouseover')
      cy.get('button#category-dropdown-1').should('not.exist')
    })
  })
})

export {}
