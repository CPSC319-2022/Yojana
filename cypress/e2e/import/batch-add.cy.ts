/*
  Use Cypress to verify the functionality of batch adding entries to both personal and master calendars
 */

// Admin - add to master and personal
// Pleb - add to personal
import 'cypress-file-upload'

describe('Batch Import Entries Tests', () => {
  function runImportProcess(fileName: string, id: number) {
    cy.get('div#category-item-1').should('exist')
    cy.get('div#category-item-1').should('be.visible')

    cy.get('button#csv-import-modal-button').should('exist')
    cy.get('button#csv-import-modal-button').should('be.visible')
    cy.get('button#csv-import-modal-button').click()

    // make sure import modal opens
    cy.get('div#import-modal-div').should('exist')
    cy.get('div#import-modal-div').should('be.visible')
    cy.get('input#dropzone').attachFile(`${fileName}`, { subjectType: 'drag-n-drop' })

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
        cy.wrap(children).get(`span.${id}-icon`).invoke('attr', 'class').should('contain', `${id}-icon`)
      })
  }

  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/?interval=Year+%28Vertical%29')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should be able to batch add to master category', () => {
      runImportProcess('test-master.csv', 1)
    })

    it('should be able to batch add to personal category', () => {
      runImportProcess('test-personal.csv', 14)
    })
  })
})

export {}
