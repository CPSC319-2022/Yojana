describe('select monthly recurring tests', () => {
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

      // select "Monthly on day 1"
      cy.get('button#recurring-monthly-some-day').click()

      // select Master Calendar
      cy.get('button#master-calendar-type-btn').click()

      // Save the category
      cy.get('button#create-category-submit-btn').trigger('click').click()

      // checks column number 0 (january) of 2023
      cy.checkIconsInDays('span#newMonthlyCat-icon', 0, 1, 27, 12)
      // checks column number 1 (february ) of 2023
      cy.checkIconsInDays('span#newMonthlyCat-icon', 1, 1, 27, 12)
      // checks column number 6 (july) of 2023
      cy.checkIconsInDays('span#newMonthlyCat-icon', 6, 1, 27, 12)
    })

    it('should be able to select "Monthly on the first Sunday" during creation in 2023 (MASTER)', () => {
      openCreateModalAndSelectMonthly()

      // select "Monthly on the first Sunday"
      cy.get('button#recurring-monthly-someX-day').click()

      // select Master Calendar
      cy.get('button#master-calendar-type-btn').click()

      // Save the category
      cy.get('button#create-category-submit-btn').trigger('click').click()

      // checks column number 0 (january) of 2023
      cy.checkIconsInDays('span#newMonthlyCat-icon', 0, 1, 27, 12)
      // checks column number 4 (may) of 2023
      cy.checkIconsInDays('span#newMonthlyCat-icon', 76, 1, 27, 12)
      // checks column number 8 (september) of 2023
      cy.checkIconsInDays('span#newMonthlyCat-icon', 32, 1, 27, 12)
    })

    it('should be able to select "Monthly on the last day" with custom start and end during creation in 2023 (MASTER)', () => {
      openCreateModalAndSelectMonthly()

      // select Master Calendar
      cy.get('button#master-calendar-type-btn').click()

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
      cy.checkIconsInDays('span#newMonthlyCat-icon', 361, 1, 31, -12, 362, 1)
      // checks column number 7 (august) of 2023
      cy.checkIconsInDays('span#newMonthlyCat-icon', 362, 1, 31, -12, 363, 2)
    })

    it('should be able to select "Monthly on the last Saturday" with custom start and end during creation in 2023 (MASTER)', () => {
      openCreateModalAndSelectMonthly()

      // select Master Calendar
      cy.get('button#master-calendar-type-btn').click()

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
      cy.checkIconsInDays('span#newMonthlyCat-icon', 290, 1, 31, 12)
      // checks column number 3 (april) of 2023
      cy.checkIconsInDays('span#newMonthlyCat-icon', 338, 1, 31, 12, 339)
      // checks column number 4 (may) of 2023
      cy.checkIconsInDays('span#newMonthlyCat-icon', 316, 1, 31, -12, 317, 4)
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
  })
})

export {}
