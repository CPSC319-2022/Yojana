import { iconPickerIcons } from '@/constants/icons'

/*
 * These are edit category tests that verify all the following features are working as expected:
 * - name, description, color, icon (picker), icon(search)
 */
describe('Edit Category', () => {
  const createNewCategory = () => {
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
  }

  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
      createNewCategory()
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should edit a new master category name', () => {
      cy.get('button#category-dropdown-20').should('exist').click()
      cy.get('button#edit-category-btn').should('exist').click()
      cy.get('div#edit-category-modal-div').should('be.visible')
      cy.get('input[name="name"]').clear()
      cy.get('input[name="name"]').type('new cat edited')
      cy.get('div#edit-category-modal-div').scrollTo('bottom')
      cy.get('button#create-category-submit-btn').click()
      cy.get('div#master-calendar-accordion-item').eq(0).children().should('contain', 'new cat edited')
    })

    it('should edit a new master category description', () => {
      cy.get('button#category-dropdown-20').should('exist').click()
      cy.get('button#edit-category-btn').should('exist').click()
      cy.get('div#edit-category-modal-div').should('be.visible')
      let description = 'description for new category'
      cy.get('textarea[name="description"]').clear()
      cy.get('textarea[name="description"]').type(description)
      cy.get('div#edit-category-modal-div').scrollTo('bottom')
      cy.get('button').contains('Update').click()
      cy.get('button#category-dropdown-20').should('exist').click()
      cy.get('button#edit-category-btn').should('exist').click({ force: true })
      cy.get('div#edit-category-modal-div').should('be.visible')
      cy.get('textarea[name="description"]').should('have.value', description)
    })
    //
    it('should edit a new master category color', () => {
      cy.get('button#category-dropdown-20').should('exist').click()
      cy.get('button#edit-category-btn').should('exist').click()
      cy.get('div#edit-category-modal-div').should('be.visible')
      cy.get('div[title="#f87171"]').click()
      cy.get('div#edit-category-modal-div').scrollTo('bottom')
      cy.get('button#master-calendar-type-btn').click()
      cy.get('button#create-category-submit-btn').click()
      cy.get('div#sidebar').scrollTo('bottom')
      cy.get('div#master-calendar-accordion-item').eq(0).children().should('contain', 'new cat')
      cy.get('div[id="category-item-20"]').should('exist')
      cy.get('input[id="checkbox-20"]')
        .parent()
        .children('label')
        .children('span')
        .children('svg')
        .invoke('attr', 'fill')
        .should('eq', '#f87171')
    })
    //
    it('should edit a new master category with icon select', () => {
      cy.get('button#category-dropdown-20').should('exist').click()
      cy.get('button#edit-category-btn').should('exist').click()
      cy.get('div#edit-category-modal-div').should('be.visible')
      cy.get('div[id="icon-picker"]').children().first().click()
      cy.get('div#edit-category-modal-div').scrollTo('bottom')
      cy.get('button#master-calendar-type-btn').click()
      cy.get('button#create-category-submit-btn').click()
      cy.get('div#sidebar').scrollTo('bottom')
      cy.get('div#master-calendar-accordion-item').eq(0).children().should('contain', 'new cat')
      cy.get('div[id="category-item-20"]').should('exist')
      cy.get('input[id="checkbox-20"]')
        .parent()
        .children('label')
        .children('span')
        .children('svg')
        .invoke('attr', 'class')
        .should('contain', iconPickerIcons[0])
    })
    it('should edit a new master category and icon search', () => {
      cy.get('button#category-dropdown-20').should('exist').click()
      cy.get('button#edit-category-btn').should('exist').click()
      cy.get('div#edit-category-modal-div').should('be.visible')
      cy.get('div[id="icon-search"]').click()
      cy.get('input[id="search-bar"]').type('airplane{enter}')
      cy.get('div[id="icon-result"]').children().first().children().first().click()
      cy.get('body').click(0, 0)
      cy.get('div#edit-category-modal-div').scrollTo('bottom')

      cy.get('button').contains('Update').click()
      cy.get('div#sidebar').scrollTo('bottom')
      cy.get('div#master-calendar-accordion-item').eq(0).children().should('contain', 'new cat')
      cy.get('div[id="category-item-20"]').should('exist')
      cy.get('input[id="checkbox-20"]')
        .parent()
        .children('label')
        .children('span')
        .children('svg')
        .invoke('attr', 'class')
        .should('contain', 'Airplane')
    })
  })
})
export {}
