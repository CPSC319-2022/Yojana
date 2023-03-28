describe('edit weekly recurring tests', () => {
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
    cy.get('button#WED-in-weekly').click()

    // Type the desired start date and end date
    cy.get('div#recurring-dates-tab-start-end').within(() => {
      cy.get('input#recurring-dates-tab-start-input').type('2023-10-10')
      cy.get('input#recurring-dates-tab-end-input').type('2023-10-31')
    })

    // Save the category
    cy.get('button#create-category-submit-btn').trigger('click').click()

    // checks October 2023 column
    cy.checkIconsInDays('span.newWeeklyCat-icon', 129, 1, 6, 12)
  }

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
