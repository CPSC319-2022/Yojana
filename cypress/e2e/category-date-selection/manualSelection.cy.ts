/*
 * Helper function that:
 * opening the "Create Category" modal,
 * filling in the name.
 */
const openCreateModalAndCreateEmptyCat = () => {
  cy.get('button#create-category-btn').click()
  cy.get('div#create-category-modal-div').should('be.visible')
  cy.get('input[name="name"]').type('newCat')
  cy.get('div#create-category-modal-div').scrollTo('bottom')
}
/*
  Use Cypress to verify the functionality of selecting a date to a category when creating a new category
*/
describe('manual selecting individual dates tests', () => {
  /*
   * selecting "Select Dates"
   * selecting the first cell in 2023 Year view,
   * and saving the changes.
   * check the appropriate spans for the icons
   */
  const selectJAN1AndCreate = (forAdmin: boolean) => {
    // check for button
    cy.get('button#select-individual-dates-btn').should('be.visible').click()

    // click on Jan 1 2023 and save
    cy.get('span#2023-0-during-selecting').should('exist')
    cy.get('div#2023-0').should('exist').click({ force: true })
    cy.get('button#save-btn-during-selecting').as('btn').click()

    // select Master Calendar if admin
    if (forAdmin) cy.get('button#master-calendar-type-btn').click()

    // scroll down and save
    cy.get('div#create-category-modal-div').scrollTo('bottom')
    cy.get('button#create-category-submit-btn').trigger('click').click()

    // check if the icon is added to Jan 1 2023 ONLY
    cy.checkIconsInDays('span.20-icon', 0, 1, 364, 12)
  }
  /*
   * selecting "Select Dates"
   * selecting the first cell once then the 12th cell in 2023 Year view twice,
   * and saving the changes.
   * check the appropriate spans for the icons
   */
  const doubleClick1Date = (forAdmin: boolean) => {
    // check for button
    cy.get('button#select-individual-dates-btn').should('be.visible').click()

    // click on Jan 2 2023 twice and save
    cy.get('span#2023-0-during-selecting').should('exist')
    cy.get('div#2023-0').should('exist').click({ force: true })
    cy.get('div#2023-12').should('exist').click({ force: true })
    cy.get('div#2023-12').should('exist').click({ force: true })
    cy.get('button#save-btn-during-selecting').as('btn').click()

    // select Master Calendar if admin
    if (forAdmin) cy.get('button#master-calendar-type-btn').click()

    // scroll down and save
    cy.get('div#create-category-modal-div').scrollTo('bottom')
    cy.get('button#create-category-submit-btn').trigger('click').click()

    // check if the icon is added to Jan 1 2023 ONLY
    cy.checkIconsInDays('span.20-icon', 0, 1, 364, 12)
  }
  /*
   * selecting "Select Dates"
   * selecting cells corresponding to Feb 1, 5, 9 of 2023 in 2023 Year view,
   * and saving the changes.
   * check the appropriate spans for the icons
   */
  const selectThreeDatesFEB = (forAdmin: boolean) => {
    // check for button
    cy.get('button#select-individual-dates-btn').should('be.visible').click()

    // click on Feb (1, 5, 9) 2023 and save
    cy.get('div#2023-1').should('exist').click({ force: true })
    cy.get('div#2023-49').should('exist').click({ force: true })
    cy.get('div#2023-97').should('exist').click({ force: true })
    cy.get('button#save-btn-during-selecting').as('btn').click()

    // select Master Calendar if admin
    if (forAdmin) cy.get('button#master-calendar-type-btn').click()

    // scroll down and save
    cy.get('div#create-category-modal-div').scrollTo('bottom')
    cy.get('button#create-category-submit-btn').trigger('click').click()

    // check if the icon is added to Feb (1, 5, 9) 2023 ONLY
    cy.checkIconsInDays('span.20-icon', 1, 1, 3, 12, 333, 97)
  }
  /*
   * beforeEach(): Logs in as admin and visits the root URL.
   * afterEach(): Resets the database after each test.
   * it(): Tests if the admin/user can select manual dates for a category during creation.
   */
  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/?interval=Year')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should be able to select 1 individual date during creation in 2023 (MASTER)', () => {
      openCreateModalAndCreateEmptyCat()

      selectJAN1AndCreate(true)
    })

    it('should check multiple clicks on 1 individual date during creation in 2023 (MASTER)', () => {
      openCreateModalAndCreateEmptyCat()

      doubleClick1Date(true)
    })

    it('should be able to select multiple individual date during creation in 2023 (MASTER)', () => {
      openCreateModalAndCreateEmptyCat()

      selectThreeDatesFEB(true)
    })
  })

  describe('pleb', () => {
    beforeEach(() => {
      cy.login('pleb')
      cy.visit('/?interval=Year')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should be able to select 1 individual date during creation in 2023 (PERSONAL)', () => {
      openCreateModalAndCreateEmptyCat()

      selectJAN1AndCreate(false)
    })

    it('should check multiple clicks on 1 individual date during creation in 2023 (PERSONAL)', () => {
      openCreateModalAndCreateEmptyCat()

      doubleClick1Date(false)
    })

    it('should be able to select multiple individual date during creation in 2023 (PERSONAL)', () => {
      openCreateModalAndCreateEmptyCat()

      selectThreeDatesFEB(false)
    })
  })
})
/*
  Use Cypress to verify the functionality of selecting a date to a category when editing a new category
*/
describe('manual editing individual dates tests', () => {
  /*
   * click on the category dropdown in the sidebar
   * click on the edit button
   * selecting "Select Dates"
   * selecting the first cell in 2023 Year view,
   * and saving the changes.
   * check the appropriate spans for the icons
   */
  const selectDuringEditToJAN1 = (forAdmin: boolean) => {
    // scroll down and save (no dates)
    cy.get('div#create-category-modal-div').scrollTo('bottom')
    cy.get('button#create-category-submit-btn').trigger('click').click()

    // Click edit
    cy.get('button#category-dropdown-20').should('exist').click()
    cy.get('button#edit-category-btn').should('exist').click()

    // check if modal is open
    cy.get('div#edit-category-modal-div').should('be.visible')

    // select Master Calendar (ADMIN ONLY)
    if (forAdmin) cy.get('button#master-calendar-type-btn').click()

    // check for button
    cy.get('button#select-individual-dates-btn').should('be.visible').click()

    // click on Jan 1 2023 and save
    cy.get('span#2023-0-during-selecting').should('exist')
    cy.get('div#2023-0').should('exist').click({ force: true })
    cy.get('button#save-btn-during-selecting').as('btn').click()

    // scroll down and save (with 1 date selected)
    cy.get('div#edit-category-modal-div').scrollTo('bottom')
    cy.get('button#create-category-submit-btn').trigger('click').click()
    // check if the icon is added to Jan 1 2023 ONLY
    cy.checkIconsInDays('span.20-icon', 0, 1, 364, 12)
  }
  /*
   * click on the category dropdown in the sidebar
   * click on the edit button
   * selecting "Select Dates"
   * selecting cells corresponding to Feb 1, 5, 9 of 2023 in 2023 Year view,
   * and saving the changes.
   * check the appropriate spans for the icons
   */
  const selectDuringEditThreeDatesFEB = (forAdmin: boolean) => {
    // scroll down and save (no dates)
    cy.get('div#create-category-modal-div').scrollTo('bottom')
    cy.get('button#create-category-submit-btn').trigger('click').click()

    // Click edit
    cy.get('button#category-dropdown-20').should('exist').click()
    cy.get('button#edit-category-btn').should('exist').click()

    // check if modal is open
    cy.get('div#edit-category-modal-div').should('be.visible')

    // select Master Calendar (ADMIN ONLY)
    if (forAdmin) cy.get('button#master-calendar-type-btn').click()

    // check for button
    cy.get('button#select-individual-dates-btn').should('be.visible').click()

    // click on Feb (1, 5, 9) 2023 and save
    cy.get('div#2023-1').should('exist').click({ force: true })
    cy.get('div#2023-49').should('exist').click({ force: true })
    cy.get('div#2023-97').should('exist').click({ force: true })
    cy.get('button#save-btn-during-selecting').as('btn').click()

    // scroll down and save
    cy.get('div#edit-category-modal-div').scrollTo('bottom')
    cy.get('button#create-category-submit-btn').trigger('click').click()

    // check if the icon is added to Feb (1, 5, 9) 2023 ONLY
    cy.checkIconsInDays('span.20-icon', 1, 1, 3, 12, 333, 97)
  }
  /*
   * beforeEach(): Logs in as admin and visits the root URL.
   * afterEach(): Resets the database after each test.
   * it(): Tests if the admin/user can select manual dates for a category during editing.
   */
  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/?interval=Year')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should be able to select 1 individual date during edit in 2023 (MASTER)', () => {
      openCreateModalAndCreateEmptyCat()

      selectDuringEditToJAN1(true)
    })

    it('should be able to select multiple individual date during edit in 2023 (MASTER)', () => {
      openCreateModalAndCreateEmptyCat()

      selectDuringEditThreeDatesFEB(true)
    })
  })

  describe('pleb', () => {
    beforeEach(() => {
      cy.login('pleb')
      cy.visit('/?interval=Year')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should be able to select 1 individual date during edit in 2023 (PERSONAL)', () => {
      openCreateModalAndCreateEmptyCat()

      selectDuringEditToJAN1(false)
    })

    it('should be able to select multiple individual date during edit in 2023 (PERSONAL)', () => {
      openCreateModalAndCreateEmptyCat()

      selectDuringEditThreeDatesFEB(false)
    })
  })
})
export {}
