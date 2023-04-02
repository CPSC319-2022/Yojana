describe('open the account dropdown and print to pdf', () => {
  const openDropdownAndPrint = () => {
    cy.get('div#account-dropdown').click()
    cy.contains('Print Calendar').should('be.visible').click()
    cy.contains('Print Year View').should('be.visible').click()
    // Wait for print dialog box to open
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Print dialog box opened.')
    })
  }

  const checkAllCategoriesDisplayed = () => {
    cy.get('#year-print').should('exist', { force: true })
    cy.get('#category-names-print').should('exist', { force: true })
  }

  const checkAllIconsDisplayed = () => {
    cy.get('#year-print').should('exist', { force: true })
    cy.get('#icons-print').should('exist', { force: true })
  }

  const checkIconsAppearInTheCalendar = () => {
    cy.get('#year-print').should('exist', { force: true })
    cy.get('#div-border').should('exist', { force: true })
    cy.get('#div-pt').should('exist', { force: true })

    const icon = cy.get(`#checkbox-1`).invoke('prop', 'icon')
    cy.get('#year-view').debug().should('contain', icon)
  }

  const checkWorkingHoursDisplayed = () => {
    cy.get('#year-view').should('contain', '160 hrs')
    cy.get('#year-view').should('contain', '200 hrs')
  }

  const checkOnlyFilteredCategoriesDisplayed = () => {
    // Filter out top category from all existing categories
    cy.get('#master-calendar-accordion-item').should('be.visible', { force: true })
    cy.get('#checkbox-1').click()

    //Check that the filtered out category does not appear in the print view
    cy.get('#year-print').should('exist', { force: true })
    cy.get(`#checkbox-1`).then(($checkbox) => {
      cy.get(`label[for=${$checkbox.attr('id')}]`)
        .invoke('text')
        .then((text) => {
          const catName = text.trim()
          cy.get('#category-names-print').should('not.contain', catName)
        })
    })
  }

  const checkYearDisplayed = () => {
    // Check that the calendar displays the year
    cy.get('#year-print').should('exist', { force: true })
    cy.get('#year-display-print').should('exist', { force: true })
  }

  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/?interval=Year')
    })

    afterEach(() => {
      cy.resetDb()
    })
    it('should check if calendar displays the year in the header', () => {
      checkYearDisplayed()
    })
    // it('should check if calendar displays only all categories', () => {
    //     checkAllCategoriesDisplayed()
    // })
    // it('should check if calendar displays all icons', () => {
    //     checkAllIconsDisplayed()
    // })
    // it('should check if only filtered categories are displayed', () => {
    //   checkOnlyFilteredCategoriesDisplayed()
    // })

    // it('should icons appear in all dates', () => {
    //     checkIconsAppearInTheCalendar()
    // })
    it('should open print dialog box', () => {
      openDropdownAndPrint()
    })
    // it('should display working hours', () => {
    //   checkWorkingHoursDisplayed()
    // })
  })

  describe('pleb', () => {
    beforeEach(() => {
      cy.login('pleb')
      cy.visit('/')
    })

    afterEach(() => {
      cy.resetDb()
    })

    // it('should be able to open the print dialog box', () => {
    //     openDropdownAndPrint()
    // })
    //
    // it('should check if year appears in the calendar', () => {
    //     checkYearDisplayed()
    // })
    //
    // // it('should check if all months appear in the calendar', () => {
    // //     checkAllMonthsDisplayed()
    // // })
    //
    // it('should check if pdf contains only valid/filtered categories', () => {
    //     checkValidCategoriesExist()
    // })
  })
})
