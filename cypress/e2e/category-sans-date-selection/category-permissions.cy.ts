/*
 * These are tests that ensure that admins can create both master categories and personal categories, while other users
 * can only create personal categories.
 */

describe('Category Permissions Test', () => {
  const createNewPersonalCategory = () => {
    cy.get('div[id="category-item-20"]').should('not.exist')
    cy.get('button#create-category-btn').click()
    cy.get('div#create-category-modal-div').should('be.visible')
    cy.get('input[name="name"]').type('new cat')
    cy.get('div#create-category-modal-div').scrollTo('bottom')
    cy.get('button#create-category-submit-btn').click()
    cy.get('div#sidebar').scrollTo('bottom')
    cy.get('div#personal-calendar-accordion-item').eq(0).children().should('contain', 'new cat')
    cy.get('div[id="category-item-20"]').should('exist')
  }

  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should create a new master category', () => {
      cy.get('div#master-calendar-accordion-item').should('be.visible')
      cy.get('div[id="category-item-20"]').should('not.exist')
      cy.get('button#create-category-btn').click()
      cy.get('div#create-category-modal-div').should('be.visible')
      cy.get('input[name="name"]').type('new cat')
      cy.get('div#create-category-modal-div').scrollTo('bottom')
      cy.get('button#master-calendar-type-btn').click()
      cy.get('button#create-category-submit-btn').click()
      cy.get('div#sidebar').scrollTo('bottom')
      cy.get('div#master-calendar-accordion-item').eq(0).children().should('contain', 'new cat')
      cy.get('div[id="category-item-20"]').should('exist')
    })

    it('should create a new personal category', () => {
      createNewPersonalCategory()
    })

    it('should delete a new master category', () => {
      cy.get('div[id="category-item-13"]').should('exist')
      cy.get('button#category-dropdown-13').should('exist').click()
      cy.get('button#delete-category-btn').should('exist').click()
      cy.get('div#confirm-delete').should('be.visible')
      cy.get('button#confirm-delete-category').click()
      cy.get('div[id="category-item-13"]').should('not.exist')
    })
    it('should delete a new personal category', () => {
      cy.get('div[id="category-item-19"]').should('exist')
      cy.get('button#category-dropdown-19').should('exist').click()
      cy.get('button#delete-category-btn').should('exist').click()
      cy.get('div#confirm-delete').should('be.visible')
      cy.get('button#confirm-delete-category').click()
      cy.get('div[id="category-item-19"]').should('not.exist')
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

    it('should not be able to create a new master category', () => {
      cy.get('div#master-calendar-accordion-item').should('be.visible')
      cy.get('div[id="category-item-20"]').should('not.exist')
      cy.get('button#create-category-btn').click()
      cy.get('div#create-category-modal-div').should('be.visible')
      cy.get('div#create-category-modal-div').scrollTo('bottom')
      cy.get('button#master-calendar-type-btn').should('not.exist')
    })

    it('should not be able to delete a master category', () => {
      cy.get('div[id="category-item-13"]').should('exist')
      cy.get('button#category-dropdown-13').should('not.exist')
    })
    it('should be able to create and delete a personal category', () => {
      createNewPersonalCategory()
      cy.get('div[id="category-item-20"]').should('exist')
      cy.get('button#category-dropdown-20').should('exist').click()
      cy.get('button#delete-category-btn').should('exist').click()
      cy.get('div#confirm-delete').should('be.visible')
      cy.get('button#confirm-delete-category').click()
      cy.get('div[id="category-item-20"]').should('not.exist')
    })
  })
})

export {}
