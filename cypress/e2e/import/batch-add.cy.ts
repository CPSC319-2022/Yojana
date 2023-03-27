// Admin - add to master and personal
// Pleb - add to personal
import 'cypress-file-upload'

describe('Batch Import Entries Tests', () => {
  before(() => {
    cy.resetDb()
  })

  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should be able to batch add to master category', () => {
      cy.get('div#category-item-1').should('exist')
      cy.get('div#category-item-1').should('be.visible')

      cy.get('button#csv-import-modal-button').should('exist')
      cy.get('button#csv-import-modal-button').should('be.visible')
      cy.get('button#csv-import-modal-button').click()

      // make sure import modal opens
      cy.get('div#import-modal-div').should('exist')
      cy.get('div#import-modal-div').should('be.visible')
      cy.get('input#dropzone').attachFile('test-master.csv', { subjectType: 'drag-n-drop' })

      cy.get('button#import-cancel').should('exist')
      cy.get('button#import-cancel').should('be.visible')
      cy.get('button#import-submit').should('exist')
      cy.get('button#import-submit').should('be.visible')
      cy.get('button#import-submit').click()

      // make sure import modal closes
      cy.get('div#import-modal-div').should('not.exist')

      // make sure alert is visible
      cy.get('div#alert').should('exist')
      cy.get('div#alert').should('be.visible')
      cy.get('div#alert').should('contain', 'Successfully added 1 entries')
      cy.wait(5000)

      // make sure alert is not visible
      cy.get('div#alert').should('not.exist')

      // move to 2025
      cy.get('button#move-right').should('exist')
      cy.get('button#move-right').should('be.visible')
      cy.get('button#move-right').click()
      cy.get('button#move-right').click()

      // make sure entry is added
      cy.get('div#2025-0')
        .children()
        .then((children) => {
          // Get the count of child elements
          const count = children.length
          console.log(count) // Output the count of child elements
          expect(count).to.equal(2)

          children.each((index, child) => {
            // Get the text of each child element
            const text = Cypress.$(child).text()
            if (index === 0) expect(text).to.equal('Circle')
          })
        })
    })

    it('should be able to batch add to personal category', () => {
      cy.get('button#csv-import-modal-button').should('exist')
      cy.get('button#csv-import-modal-button').should('be.visible')
      cy.get('button#csv-import-modal-button').click()

      // make sure import modal opens
      cy.get('div#import-modal-div').should('exist')
      cy.get('div#import-modal-div').should('be.visible')
      cy.get('input#dropzone').attachFile('test-personal.csv', { subjectType: 'drag-n-drop' })

      cy.get('button#import-cancel').should('exist')
      cy.get('button#import-cancel').should('be.visible')
      cy.get('button#import-submit').should('exist')
      cy.get('button#import-submit').should('be.visible')
      cy.get('button#import-submit').click()

      // make sure import modal closes
      cy.get('div#import-modal-div').should('not.exist')

      // make sure alert is visible
      cy.get('div#alert').should('exist')
      cy.get('div#alert').should('be.visible')
      cy.get('div#alert').should('contain', 'Successfully added 1 entries')
      cy.wait(5000)

      // make sure alert is not visible
      cy.get('div#alert').should('not.exist')

      // move to 2025
      cy.get('button#move-right').should('exist')
      cy.get('button#move-right').should('be.visible')
      cy.get('button#move-right').click()
      cy.get('button#move-right').click()

      // make sure entry is added
      cy.get('div#2025-0')
        .children()
        .then((children) => {
          // Get the count of child elements
          const count = children.length
          console.log(count) // Output the count of child elements
          expect(count).to.equal(2)

          children.each((index, child) => {
            // Get the text of each child element
            const text = Cypress.$(child).text()
            if (index === 0) expect(text).to.equal('CurrencyDollar')
          })
        })
    })
  })
})

export {}
