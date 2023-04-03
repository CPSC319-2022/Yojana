/*
  Use Cypress to verify the functionality of editing monthly recurring events in both personal and master calendars
*/
describe('edit monthly recurring tests', () => {
  /*
   * opening the "Create Category" modal,
   * filling in the name,
   * and selecting the "Monthly" recurring option for a new category.
   */
  const openCreateModalAndSelectMonthly = () => {
    cy.get('button#create-category-btn').click()
    cy.get('div#create-category-modal-div').should('be.visible')
    cy.get('input[name="name"]').type('newMonthlyCat')
    cy.get('div#create-category-modal-div').scrollTo('bottom')

    // Open and check the recurring dates selection
    cy.get('button#recurring-dates-disclosure-btn').click()
    cy.get('div#recurring-dates-panel').should('be.visible')
    cy.get('button#recurring-dates-tab-monthly').click()
    cy.get('div#recurring-dates-upper-contents').should('be.visible')
    cy.get('div#recurring-dates-tab-start-end').should('be.visible')
    cy.get('div#recurring-dates-tab-start-end').should('be.visible')
  }
  /*
   * opening the "Edit Category" modal,
   * selecting the "Monthly on day 1" recurring option,
   * and saving the changes.
   * check the appropriate spans for the icons.
   */
  const openEditModalAndSelectMONTHLYDAY1 = (forAdmin: boolean) => {
    // Save the category
    cy.get('button#create-category-submit-btn').trigger('click').click()
    cy.get('div[id="category-item-20"]').should('exist')

    // Click edit
    cy.get('button#category-dropdown-20').should('exist').click()
    cy.get('button#edit-category-btn').should('exist').click()

    // check if modal is open
    cy.get('div#edit-category-modal-div').should('be.visible')

    // select Master Calendar (ADMIN ONLY)
    if (forAdmin) cy.get('button#master-calendar-type-btn').click()

    // select ...
    cy.get('div#edit-category-modal-div').scrollTo('bottom')
    cy.get('button#recurring-dates-disclosure-btn').click()
    cy.get('button#recurring-dates-tab-monthly').click()

    // select start and end
    cy.get('div#recurring-dates-tab-start-end').within(() => {
      cy.get('input#recurring-dates-tab-start-input').type('2023-03-01')
      cy.get('input#recurring-dates-tab-end-input').type('2023-11-30')
    })

    // select "Monthly on day 1"
    cy.get('button#recurring-monthly-some-day').click()

    // Save the category
    cy.get('button#create-category-submit-btn').trigger('click').click()

    // checks column number 2 (march) of 2023
    cy.checkIconsInDays('span.20-icon', 2, 1, 27, 12)
    // checks column number 5 (june) of 2023
    cy.checkIconsInDays('span.20-icon', 5, 1, 27, 12)
  }
  /*
   * beforeEach(): Logs in as admin and visits the root URL.
   * afterEach(): Resets the database after each test.
   * it(): Tests if the admin/user can edit a monthly recurring event and select "Monthly on day 1" for the master calendar.
   */
  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/?interval=Year+%28Vertical%29')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should be able to edit monthly recurring and select "Monthly on day 1" in 2023 (MASTER)', () => {
      openCreateModalAndSelectMonthly()

      openEditModalAndSelectMONTHLYDAY1(true)
    })
  })

  describe('pleb', () => {
    beforeEach(() => {
      cy.login('pleb')
      cy.visit('/?interval=Year+%28Vertical%29')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should be able to edit monthly recurring and select "Monthly on day 1" in 2023 (PERSONAL)', () => {
      openCreateModalAndSelectMonthly()

      openEditModalAndSelectMONTHLYDAY1(false)
    })
  })
})

export {}
