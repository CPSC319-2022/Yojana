describe('select weekly recurring tests', () => {
  const openCreateModalAndSelectWeekly = () => {
    cy.get('button#create-category-btn').click()
    cy.get('div#create-category-modal-div').should('be.visible')
    cy.get('input[name="name"]').type('some random new cat for weekly recurring')
    cy.get('div#create-category-modal-div').scrollTo('bottom')

    // Open and check the recurring dates selection
    cy.get('button#recurring-dates-disclosure-btn').click()
    cy.get('div#recurring-dates-panel').should('be.visible')
    cy.get('button#recurring-dates-tab-weekly').click()
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

    it('should be able to select SUN MON weekly recurring dates during creation in 2023', () => {
      openCreateModalAndSelectWeekly()

      // select SUN MON
      cy.get('button#SUN-in-weekly').click()
      cy.get('button#MON-in-weekly').click()

      // Save the category
      cy.get('button#create-category-submit-btn').trigger('click')
      cy.get('button#create-category-submit-btn').click()

      // Check icons in year view to match the selected weekly recurring dates
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      let daysToSkip = 0
      for (let month = 0; month < 12; month++) {
        let startingDay = daysToSkip > 0 ? daysToSkip : 0

        for (let day = startingDay; day < daysInMonth[month]; day += 7) {
          // Check the two consecutive days
          for (let i = 0; i < 2; i++) {
            if (day + i < daysInMonth[month]) {
              const currentSelectedDateId = `2023-${month}-${day + i}`
              const currentDivId = `div#${currentSelectedDateId}`
              cy.get(currentDivId).find('span#some random new cat for weekly recurring-icon').should('exist')
            }
          }

          // Check other 5 days
          for (let i = 2; i < 7; i++) {
            if (day + i < daysInMonth[month]) {
              const currentSelectedDateId = `2023-${month}-${day + i}`
              const currentDivId = `div#${currentSelectedDateId}`
              !cy.get(currentDivId).find('span#some random new cat for weekly recurring-icon').should('exist')
            }
          }

          // Check if there are remaining days to be skipped at the end of the month
          if (day + 7 >= daysInMonth[month]) {
            daysToSkip = 7 - (daysInMonth[month] - day)
          } else {
            daysToSkip = 0
          }
        }
      }
    })

    it('should be able to change start and end date for weekly recurring during creation in 2023', () => {
      openCreateModalAndSelectWeekly()

      // select FRI
      cy.get('button#FRI-in-weekly').click()
      // Type the desired start date (January 1, 2023) and end date (January 31, 2023)
      cy.get('div#recurring-dates-tab-start-end input:nth-child(2)').type('2023-01-01')
      cy.get('div#recurring-dates-tab-start-end input:nth-child(4)').type('2023-01-31')

      // Save the category
      cy.get('button#create-category-submit-btn').click()
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
