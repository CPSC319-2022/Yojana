describe('Unselect all category', () => {
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

    it('should uncheck all checkboxes in master when eye icon is clicked', () => {
      for (let i = 1; i < 14; i++) {
        checked(i)
      }
      cy.get('#master-toggle-all').click()
      for (let i = 1; i < 14; i++) {
        notChecked(i)
      }
    })

    it('should uncheck all checkboxes in master when eye icon is clicked', () => {
      for (let i = 14; i < 20; i++) {
        checked(i)
      }
      cy.get('#personal-toggle-all').click()
      for (let i = 14; i < 20; i++) {
        notChecked(i)
      }
    })
  })

  describe('pleb', () => {
    beforeEach(() => {
      cy.login('pleb')
      cy.visit('/')
    })

    it('should uncheck all checkboxes in master when eye icon is clicked', () => {
      for (let i = 1; i < 14; i++) {
        checked(i)
      }
      cy.get('#master-toggle-all').click()
      for (let i = 1; i < 14; i++) {
        notChecked(i)
      }
    })
  })
})
export {}
