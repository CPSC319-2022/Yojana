/*
  Use Cypress to verify the functionality of editing weekly recurring events in both personal and master calendars
*/
describe('edit weekly recurring tests', () => {
  /*
   * opening the "Create Category" modal,
   * filling in the name,
   * and selecting the "Weekly" recurring option for a new category.
   */
  const openCreateModalAndSelectWeekly = () => {
    cy.get('button#create-category-btn').click()
    cy.get('div#create-category-modal-div').should('be.visible')
    cy.get('input[name="name"]').type('newWeeklyCat')
    cy.get('div#create-category-modal-div').scrollTo('bottom')

    // Open and check the recurring dates selection
    cy.get('button#recurring-dates-disclosure-btn').click()
    cy.get('div#recurring-dates-panel').should('be.visible')
    cy.get('button#recurring-dates-tab-weekly').click()
    cy.get('div#recurring-dates-upper-contents').should('be.visible')
    cy.get('div#recurring-dates-tab-start-end').should('be.visible')
    cy.get('div#recurring-dates-tab-start-end').should('be.visible')
  }
  /*
   * opening the "Edit Category" modal,
   * selecting the "WED" recurring option,
   * entering the desired start and end dates (2023-10-10 to 2023-10-31),
   * and saving the changes.
   * check the appropriate spans for the icons.
   */
  const openEditModalAndSelectWEDOCT = (forAdmin: boolean) => {
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

    // select WED
    cy.get('div#edit-category-modal-div').scrollTo('bottom')
    cy.get('button#recurring-dates-disclosure-btn').click()
    cy.get('button#recurring-dates-tab-weekly').click()
    cy.get('div#edit-category-modal-div').scrollTo('bottom')
    cy.get('button#WED-in-weekly').click()

    // Type the desired start date and end date
    cy.get('div#recurring-dates-tab-start-end').within(() => {
      cy.get('input#recurring-dates-tab-start-input').type('2023-10-10')
      cy.get('input#recurring-dates-tab-end-input').type('2023-10-31')
    })

    // Save the category
    cy.get('button#create-category-submit-btn').trigger('click').click()

    // checks October 2023 column
    cy.checkIconsInDays('span.20-icon', 129, 1, 6, 12)
  }
  /*
   * beforeEach(): Logs in as admin and visits the root URL.
   * afterEach(): Resets the database after each test.
   * it(): Tests if the admin/user can edit a weekly recurring event and select "WED" on desired dates.
   */
  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should be able to edit weekly recurring and select WED in 2023 (MASTER)', () => {
      openCreateModalAndSelectWeekly()

      openEditModalAndSelectWEDOCT(true)
    })
  })

  describe('pleb', () => {
    beforeEach(() => {
      cy.login('pleb')
      cy.visit('/')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should be able to edit weekly recurring and select WED in 2023 (PERSONAL)', () => {
      openCreateModalAndSelectWeekly()

      openEditModalAndSelectWEDOCT(false)
    })
  })
})

export {}
