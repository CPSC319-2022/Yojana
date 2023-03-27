describe('Export Calendars', () => {
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
  })
})

export {}
