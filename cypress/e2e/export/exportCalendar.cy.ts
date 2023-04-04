/*
 * This is a Cypress test file that tests the functionality of exporting calendars. The file includes multiple test
 * cases for different types of calendar exports such as the Master Calendar, Personal Calendar, and Filtered Categories.
 * The tests are separated by user roles, admin and pleb, and are designed to test the functionality of the calendar
 * export feature for each role.
 */
describe('Export Calendars', () => {
  // don't run these tests in headless mode due to https://github.com/cypress-io/cypress/issues/24775
  if (!Cypress.config('isInteractive')) {
    return
  }

  const checkedCats: number[] = []
  const checked = (number: number) => {
    cy.get(`div#category-item-${number}`).find('input[type="checkbox"]').should('have.prop', 'checked', true)
    checkedCats.push(number)
  }
  const notChecked = (number: number) => {
    cy.get(`div#category-item-${number}`).find('input[type="checkbox"]').should('have.prop', 'checked', false)
  }
  const adminID = 'f0b54ab0-366f-45b1-b750-1d5b79f3603c'
  const plebID = 'e7da4fbe-9a15-4935-a369-963ee558f0ea'

  function masterCalendar() {
    it('should download Master Calendar', () => {
      cy.get('#account-dropdown').click() // Click the account dropdown
      cy.contains('Export Calendar').click() // Click the Export Calendar accordion
      cy.contains('Master Calendar').click() // Click the Master Calendar button
      cy.request('/api/dates/export?master=true').then((response) => {
        // Check that the file was downloaded successfully
        expect(response.status).to.eq(200) // Verify that the HTTP status code is 200 (OK)
        // Check that the calendar contains dates for the first category (Statutory Holiday)
        expect(response.body).to.contain('Statutory Holiday')
      })
    })
  }

  before(() => {
    // Add some dates to the master calendar
    cy.login('admin')
    cy.visit('/')
    // add dates to a master calendar category
    // Click edit
    cy.get('button#category-dropdown-1').should('exist').click()
    cy.get('button#edit-category-btn').should('exist').click()

    // check if modal is open
    cy.get('div#edit-category-modal-div').should('be.visible')

    // select WED
    cy.get('div#edit-category-modal-div').scrollTo('bottom')
    cy.get('button#recurring-dates-disclosure-btn').click()
    cy.get('button#recurring-dates-tab-weekly').click()
    cy.get('div#edit-category-modal-div').scrollTo('bottom')
    cy.get('button#WED-in-weekly').click()

    // Save the category
    cy.get('button#create-category-submit-btn').trigger('click').click()
  })

  after(() => {
    cy.resetDb()
  })

  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
    })

    masterCalendar()

    it('should download Personal Calendar', () => {
      cy.get('#account-dropdown').click() // Click the account dropdown
      cy.contains('Export Calendar').click() // Click the Export Calendar accordion
      cy.contains('Personal Calendar').click() // Click the Personal Calendar button
      cy.request(`/api/dates/export?master=false&userID=${adminID}`).then((response) => {
        // Check that the file was downloaded successfully
        expect(response.status).to.eq(200) // Verify that the HTTP status code is 200 (OK)
        expect(response.body).to.include('PayDay')
      })
    })

    it('should download Filtered Calendar', () => {
      cy.get('div#sidebar').scrollTo('bottom')
      for (let i = 14; i < 19; i++) {
        cy.get(`div#category-item-${i}`).find(`input[type="checkbox"]`).uncheck({ force: true })
        notChecked(i)
      }
      cy.get(`div#category-item-19`).find(`input[type="checkbox"]`).check({ force: true })
      checked(19)
      const checkedCatsString = checkedCats.join(',')
      cy.get('#account-dropdown').click() // Click the account dropdown
      cy.contains('Export Calendar').click() // Click the Export Calendar accordion
      cy.contains('Filtered Categories').click() // Click the Personal Calendar button
      cy.request(`/api/dates/export?categories=${checkedCatsString}`).then((response) => {
        // Check that the file was downloaded successfully
        expect(response.status).to.eq(200) // Verify that the HTTP status code is 200 (OK)
        // check that category (14 - PayDay) is not included
        expect(response.body).to.not.include('PayDay')
        // check that category (19 - Birthday) is included
        expect(response.body).to.include('Birthday')
      })
    })
  })

  describe('pleb', () => {
    beforeEach(() => {
      cy.login('pleb')
      cy.visit('/')
    })

    masterCalendar()

    it('should download Personal Calendar', () => {
      cy.get('#account-dropdown').click() // Click the account dropdown
      cy.contains('Export Calendar').click() // Click the Export Calendar accordion
      cy.contains('Personal Calendar').click() // Click the Personal Calendar button
      cy.request(`/api/dates/export?master=false&userID=${plebID}`).then((response) => {
        // Check that the file was downloaded successfully
        expect(response.status).to.eq(200) // Verify that the HTTP status code is 200 (OK)
      })
    })
  })
})

export {}
