/**
    These are the cypress tests to check if the Print to pdf - Year Scroll View shows the expected behaviour.

    Note: User needs to click 'Cancel' when Print dialog box appears to prevent tests from stalling.
 **/

describe('print year (scroll) view tests', () => {
  const openDropdownAndPrint = () => {
    cy.get('div#account-dropdown').click()
    cy.contains('Print Calendar').should('be.visible').click()
    cy.contains('Print Year Scroll View').should('be.visible').click()

    // Stub window.print() method before opening the print dialog
    cy.window().then((win) => {
      cy.stub(win, 'print')
    })

    cy.get('#year-print').should('exist', { force: true })
  }

  const checkYearDisplayed = () => {
    openDropdownAndPrint()

    cy.get('#year-display-print').should('exist', { force: true })
  }

  const checkAllCategoriesDisplayed = () => {
    openDropdownAndPrint()

    cy.get('#category-names-print').should('exist', { force: true })
  }

  const checkAllIconsDisplayed = () => {
    openDropdownAndPrint()

    cy.get('#icons-print').should('exist', { force: true })
  }

  const checkWorkingHoursDisplayed = () => {
    openDropdownAndPrint()

    cy.get('#year-scroll-view').should('contain', '160 hrs')
    cy.get('#year-scroll-view').should('contain', '200 hrs')
  }

  const checkOnlyFilteredCategoriesDisplayed = () => {
    // Filter out top category from all existing categories
    cy.get('#master-calendar-accordion-item').should('be.visible', { force: true })
    cy.get('#checkbox-1').click()

    openDropdownAndPrint()

    //Check that the filtered out category does not appear in the print view
    cy.get(`#checkbox-1`).then(($checkbox) => {
      cy.get(`label[for=${$checkbox.attr('id')}]`)
        .invoke('text')
        .then((text) => {
          const catName = text.trim()
          cy.get('#category-names-print').should('not.contain', catName)
        })
    })

    cy.resetDb()
  }

  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
    })

    afterEach(() => {
      cy.resetDb()
    })
    // Test to open the print dialog box for year view and check if year print component exists
    it('should open print dialog box', () => {
      openDropdownAndPrint()
    })

    // Test to see if the year is displayed in the header of the print scroll view
    it('should check if calendar displays the year in the header', () => {
      checkYearDisplayed()
    })

    // Test to see if all categories appear in the print scroll view
    it('should check if calendar displays all categories', () => {
      checkAllCategoriesDisplayed()
    })

    // Test to see if all icons appear in the print scroll view
    it('should check if calendar displays all icons', () => {
      checkAllIconsDisplayed()
    })

    // Test to see if the Total Working Hours for months are displayed in the year print scroll view
    it('should display working hours', () => {
      checkWorkingHoursDisplayed()
    })

    // Test to see if only the filtered categories appear in the print scroll view
    it('should check if only filtered categories are displayed', () => {
      checkOnlyFilteredCategoriesDisplayed()
    })
  })
})
