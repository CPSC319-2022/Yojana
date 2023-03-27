import { iconPickerIcons } from '@/components/CategoryModal/IconPicker'

describe('View all category', () => {
  const checkPersonalCategory = (categoryItemNumber) => {
    cy.get('div[id="category-item-${categoryItemNumber}"]').should('not.exist')
    cy.get('button#create-category-btn').click()
    cy.get('div#create-category-modal-div').should('be.visible')
    cy.get('input[name="name"]').type('new cat')
    cy.get('div#create-category-modal-div').scrollTo('bottom')
    cy.get('button#create-category-submit-btn').click()
    cy.get('div#sidebar').scrollTo('bottom')
    cy.get('div#personal-calendar-accordion-item').eq(0).children().should('contain', 'new cat')
    cy.get(`div#category-item-${categoryItemNumber}`).should('exist')
    cy.get(`div#category-item-${categoryItemNumber}`).find(`input[type="checkbox"]`).should('be.checked')
  }

  const unselectCategory = (categoryItemNumber) => {
    cy.get(`div#category-item-${categoryItemNumber}`).find(`input[type="checkbox"]`).uncheck()
    cy.get(`div#category-item-${categoryItemNumber}`).find(`input[type="checkbox"]`).should('be.unchecked')
  }

  const checkMasterCategory = (categoryItemNumber) => {
    cy.get('div[id="category-item-${categoryItemNumber}"]').should('not.exist')
    cy.get('button#create-category-btn').click()
    cy.get('div#create-category-modal-div').should('be.visible')
    cy.get('input[name="name"]').type('new cat')
    cy.get('div#create-category-modal-div').scrollTo('bottom')
    cy.get('button#master-calendar-type-btn').click()
    cy.get('button#create-category-submit-btn').click()
    cy.get('div#sidebar').scrollTo('bottom')
    cy.get('div#personal-calendar-accordion-item').eq(0).children().should('contain', 'new cat')
    cy.get(`div#category-item-${categoryItemNumber}`).should('exist')
    cy.get(`div#category-item-${categoryItemNumber}`).find(`input[type="checkbox"]`).should('be.checked')
  }

  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should create and unselect 10 categories in master accordion', () => {
      for (let i = 20; i < 31; i++) {
        checkMasterCategory(i)
      }
      for (let i = 20; i < 31; i + 2) {
        unselectCategory(i)
      }
    })

    it('should create and unselect 10 category in personal accordion', () => {
      for (let i = 20; i < 31; i++) {
        checkPersonalCategory(i)
      }
      for (let i = 20; i < 31; i + 2) {
        unselectCategory(i)
      }
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

    it('should create and unselect 10 category in personal accordion', () => {
      for (let i = 20; i < 31; i++) {
        checkPersonalCategory(i)
      }
      for (let i = 20; i < 31; i + 2) {
        unselectCategory(i)
      }
    })
  })
})

export {}
