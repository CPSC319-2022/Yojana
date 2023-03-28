describe('Export Calendars', () => {
  const checkedCats: number[] = []
  const checked = (number: number) => {
    cy.get(`div#category-item-${number}`).find('input[type="checkbox"]').should('have.prop', 'checked', true)
    checkedCats.push(number)
  }
  const notChecked = (number: number) => {
    cy.get(`div#category-item-${number}`).find('input[type="checkbox"]').should('have.prop', 'checked', false)
  }
  const adminID = 'f0b54ab0-366f-45b1-b750-1d5b79f3603c'

  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should download Master Calendar', () => {
      cy.get('#account-dropdown').click() // Click the account dropdown
      cy.contains('Export Calendar').click() // Click the Export Calendar accordion
      cy.contains('Master Calendar').click() // Click the Master Calendar button
      cy.request('/api/dates/export?master=true').then((response) => {
        // Check that the file was downloaded successfully
        expect(response.status).to.eq(200) // Verify that the HTTP status code is 200 (OK)
      })
    })

    it('should download Personal Calendar', () => {
      cy.get('#account-dropdown').click() // Click the account dropdown
      cy.contains('Export Calendar').click() // Click the Export Calendar accordion
      cy.contains('Personal Calendar').click() // Click the Personal Calendar button
      cy.request(`/api/dates/export?master=false&userID=${adminID}`).then((response) => {
        // Check that the file was downloaded successfully
        expect(response.status).to.eq(200) // Verify that the HTTP status code is 200 (OK)
      })
    })

    it('should download Filtered Calendar', () => {
      cy.get('div#sidebar').scrollTo('bottom')
      cy.get(`div#category-item-19`).find(`input[type="checkbox"]`).uncheck()
      cy.get(`div#category-item-18`).find(`input[type="checkbox"]`).uncheck()
      for (let i = 1; i < 18; i++) {
        checked(i)
      }

      for (let i = 18; i < 20; i++) {
        notChecked(i)
      }
      const checkedCatsString = checkedCats.join(',')
      cy.get('#account-dropdown').click() // Click the account dropdown
      cy.contains('Export Calendar').click() // Click the Export Calendar accordion
      cy.contains('Filtered Categories').click() // Click the Personal Calendar button
      cy.request(`/api/dates/export?categories=${checkedCatsString}`).then((response) => {
        // Check that the file was downloaded successfully
        expect(response.status).to.eq(200) // Verify that the HTTP status code is 200 (OK)
      })
    })
  })
})

export {}
