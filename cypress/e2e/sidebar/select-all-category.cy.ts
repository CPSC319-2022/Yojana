describe('View all category', () => {
  const checked = (number) => {
    cy.get(`div#category-item-${number}`).find('input[type="checkbox"]').should('have.prop', 'checked', true)
  }

  const notChecked = (number) => {
    cy.get(`div#category-item-${number}`).find('input[type="checkbox"]').should('have.prop', 'checked', false)
  }

  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should uncheck all checkboxes when second icon is clicked', () => {
      for (let i = 1; i < 14; i++) {
        checked(i)
      }

      cy.get('div#master-calendar-accordion-item').find('button').eq(0).click()

      for (let i = 1; i < 14; i++) {
        notChecked(i)
      }

      // Click the second icon in the personal calendar accordion
      cy.get('div#personal-calendar-accordion-item').contains('button', 'Show/hide categories').should('exist')
    })
  })
})
export {}
