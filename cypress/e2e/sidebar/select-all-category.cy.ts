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

  const checkStatus = (categoryItemNumber) => {
    cy.get(`div#category-item-${categoryItemNumber}`).find(`input[type="checkbox"]`).should('be.unchecked')
  }
  const checkStatusChecked = (categoryItemNumber) => {
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

    it('should uncheck all checkboxes when second icon is clicked', () => {
      for (let i = 20; i < 31; i++) {
        checkMasterCategory(i)
      }
      cy.get(`#master-calendar-accordion-item`).find('button').eq(1).click()
      for (let i = 20; i < 31; i++) {
        checkStatus(i)
      }
      cy.get(`#master-calendar-accordion-item`).find('button').eq(1).click()
      for (let i = 20; i < 31; i++) {
        checkStatusChecked(i)
      }
    })

    it('should uncheck all checkboxes when second icon is clicked', () => {
      for (let i = 20; i < 31; i++) {
        checkPersonalCategory(i)
      }
      cy.get(`#personal-calendar-accordion-item`).find('button').eq(1).click()
      for (let i = 20; i < 31; i++) {
        checkStatus(i)
      }
      cy.get(`#personal-calendar-accordion-item`).find('button').eq(1).click()
      for (let i = 20; i < 31; i++) {
        checkStatusChecked(i)
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

    it('should uncheck all checkboxes when second icon is clicked', () => {
      for (let i = 20; i < 31; i++) {
        checkPersonalCategory(i)
      }
      cy.get(`#personal-calendar-accordion-item`).find('button').eq(1).click()
      for (let i = 20; i < 31; i++) {
        checkStatus(i)
      }
      cy.get(`#personal-calendar-accordion-item`).find('button').eq(1).click()
      for (let i = 20; i < 31; i++) {
        checkStatusChecked(i)
      }
    })
  })
})

export {}
