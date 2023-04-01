describe('Select all category', () => {
  const checked = (number: number) => {
    cy.get(`div#category-item-${number}`).find('input[type="checkbox"]').should('have.prop', 'checked', true)
  }

  const notChecked = (number: number) => {
    cy.get(`div#category-item-${number}`).find('input[type="checkbox"]').should('have.prop', 'checked', false)
  }

  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
    })

    it('should uncheck all checkboxes in master when eye is clicked and when eye clicked again all should be checked', () => {
      cy.get('#master-toggle-all').click()
      cy.get('#master-toggle-all').click()
      for (let i = 1; i < 14; i++) {
        checked(i)
      }
    })

    it('should uncheck all checkboxes in personal when eye is clicked and when eye clicked again all should be checked', () => {
      cy.get('#personal-toggle-all').click()
      cy.get('#personal-toggle-all').click()
      for (let i = 14; i < 20; i++) {
        checked(i)
      }
    })
  })

  describe('pleb', () => {
    beforeEach(() => {
      cy.login('pleb')
      cy.visit('/')
    })

    it('should uncheck all checkboxes in master when eye is clicked and when eye clicked again all should be checked', () => {
      cy.get('#master-toggle-all').click()
      cy.get('#master-toggle-all').click()
      for (let i = 1; i < 14; i++) {
        checked(i)
      }
    })
  })
})
export {}
