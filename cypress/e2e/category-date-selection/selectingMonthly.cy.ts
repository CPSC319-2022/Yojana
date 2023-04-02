/*
  Use Cypress to verify the functionality of selecting monthly recurring events in both personal and master calendars
*/
describe('select monthly recurring tests', () => {
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
   * selecting the "Monthly on day 1" recurring option,
   * and saving the changes.
   * check the appropriate spans for the icons.
   */
  const createMONTHLYDAY1 = (forAdmin: boolean) => {
    // select "Monthly on day 1"
    cy.get('button#recurring-monthly-some-day').click()

    // select Master Calendar if admin
    if (forAdmin) cy.get('button#master-calendar-type-btn').click()

    // Save the category
    cy.get('button#create-category-submit-btn').trigger('click').click()

    // checks column number 0 (january) of 2023
    cy.checkIconsInDays('span.20-icon', 0, 1, 27, 12)
    // checks column number 1 (february ) of 2023
    cy.checkIconsInDays('span.20-icon', 1, 1, 27, 12)
    // checks column number 6 (july) of 2023
    cy.checkIconsInDays('span.20-icon', 6, 1, 27, 12)
  }
  /*
   * selecting the "Monthly-someX-day" recurring option,
   * and saving the changes.
   * check the appropriate spans for the icons.
   */
  const createMONTHLYFIRSTSAT = (forAdmin: boolean) => {
    // select "Monthly on the first Sunday"
    cy.get('button#recurring-monthly-someX-day').click()

    // select Master Calendar if admin
    if (forAdmin) cy.get('button#master-calendar-type-btn').click()

    // Save the category
    cy.get('button#create-category-submit-btn').trigger('click').click()

    // checks column number 0 (january) of 2023
    cy.checkIconsInDays('span.20-icon', 0, 1, 27, 12)
    // checks column number 4 (may) of 2023
    cy.checkIconsInDays('span.20-icon', 76, 1, 27, 12)
    // checks column number 8 (september) of 2023
    cy.checkIconsInDays('span.20-icon', 32, 1, 27, 12)
  }
  /*
   * selecting the "Monthly-last-day" recurring option,
   * and saving the changes.
   * check the appropriate spans for the icons.
   */
  const createMONTHLYLASTDAY = (forAdmin: boolean) => {
    // select Master Calendar if admin
    if (forAdmin) cy.get('button#master-calendar-type-btn').click()

    // select start and end
    cy.get('div#recurring-dates-tab-start-end').within(() => {
      cy.get('input#recurring-dates-tab-start-input').type('2023-07-31')
      cy.get('input#recurring-dates-tab-end-input').type('2023-09-01')
    })

    // select "Monthly on the last day"
    cy.get('button#recurring-monthly-last-day').click()

    // Save the category
    cy.get('button#create-category-submit-btn').trigger('click').click()

    // checks column number 6 (july) of 2023
    cy.checkIconsInDays('span.20-icon', 361, 1, 31, -12, 362, 1)
    // checks column number 7 (august) of 2023
    cy.checkIconsInDays('span.20-icon', 362, 1, 31, -12, 363, 2)
  }
  /*
   * selecting the "Monthly-lastX-day" recurring option,
   * and saving the changes.
   * check the appropriate spans for the icons.
   */
  const createMONTHLYLASTSAT = (forAdmin: boolean) => {
    // select Master Calendar if admin
    if (forAdmin) cy.get('button#master-calendar-type-btn').click()

    // select start and end
    cy.get('div#recurring-dates-tab-start-end').within(() => {
      cy.get('input#recurring-dates-tab-start-input').type('2023-03-25')
      cy.get('input#recurring-dates-tab-end-input').type('2023-06-06')
    })

    // select "Monthly on the last Saturday"
    cy.get('button#recurring-monthly-lastX-day').click()

    // Save the category
    cy.get('button#create-category-submit-btn').trigger('click').click()

    // checks column number 2 (march) of 2023
    cy.checkIconsInDays('span.20-icon', 290, 1, 31, 12)
    // checks column number 3 (april) of 2023
    cy.checkIconsInDays('span.20-icon', 338, 1, 31, 12, 339)
    // checks column number 4 (may) of 2023
    cy.checkIconsInDays('span.20-icon', 316, 1, 31, -12, 317, 4)
  }
  /*
   * beforeEach(): Logs in as admin and visits the root URL.
   * afterEach(): Resets the database after each test.
   * it(): Tests if the admin/user can select monthly recurring for a category.
   */
  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should be able to select "Monthly on day 1" during creation in 2023 (MASTER)', () => {
      openCreateModalAndSelectMonthly()

      createMONTHLYDAY1(true)
    })

    it('should be able to select "Monthly on the first Sunday" during creation in 2023 (MASTER)', () => {
      openCreateModalAndSelectMonthly()

      createMONTHLYFIRSTSAT(true)
    })

    it('should be able to select "Monthly on the last day" with custom start and end during creation in 2023 (MASTER)', () => {
      openCreateModalAndSelectMonthly()

      createMONTHLYLASTDAY(true)
    })

    it('should be able to select "Monthly on the last Saturday" with custom start and end during creation in 2023 (MASTER)', () => {
      openCreateModalAndSelectMonthly()

      createMONTHLYLASTSAT(true)
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

    it('should be able to select "Monthly on day 1" during creation in 2023 (PERSONAL)', () => {
      openCreateModalAndSelectMonthly()

      createMONTHLYDAY1(false)
    })

    it('should be able to select "Monthly on the first Sunday" during creation in 2023 (PERSONAL)', () => {
      openCreateModalAndSelectMonthly()

      createMONTHLYFIRSTSAT(false)
    })

    it('should be able to select "Monthly on the last day" with custom start and end during creation in 2023 (PERSONAL)', () => {
      openCreateModalAndSelectMonthly()

      createMONTHLYLASTDAY(false)
    })

    it('should be able to select "Monthly on the last Saturday" with custom start and end during creation in 2023 (PERSONAL)', () => {
      openCreateModalAndSelectMonthly()

      createMONTHLYLASTSAT(false)
    })
  })
})

export {}
