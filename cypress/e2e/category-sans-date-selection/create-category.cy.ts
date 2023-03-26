describe('Create Category', () => {
  function submitNewCategory() {
    cy.get('div#create-category-modal-div').scrollTo('bottom')
    cy.get('button#master-calendar-type-btn').click()
    cy.get('button#create-category-submit-btn').click()
    cy.get('div#sidebar').scrollTo('bottom')
  }

  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should create a new master category with name', () => {
      cy.get('div#master-calendar-accordion-item').should('be.visible')
      cy.get('div[id="category-item-20"]').should('not.exist')
      cy.get('button#create-category-btn').click()
      cy.get('div#create-category-modal-div').should('be.visible')
      cy.get('input[name="name"]').type('new cat')
      submitNewCategory()
      cy.get('div#master-calendar-accordion-item').eq(0).children().should('contain', 'new cat')
      cy.get('div[id="category-item-20"]').should('exist')
    })

    it('should create a new master category with name and description', () => {
      cy.get('div#master-calendar-accordion-item').should('be.visible')
      cy.get('div[id="category-item-20"]').should('not.exist')
      cy.get('button#create-category-btn').click()
      cy.get('div#create-category-modal-div').should('be.visible')
      cy.get('input[name="name"]').type('new cat')
      let description = 'description for new category'
      cy.get('textarea[name="description"]').type(description)
      submitNewCategory()
      cy.get('div#master-calendar-accordion-item').eq(0).children().should('contain', 'new cat')
      cy.get('div[id="category-item-20"]').should('exist')
      cy.get('button#category-dropdown-20').should('exist').click()
      cy.get('button#edit-category-btn').should('exist').click()
      cy.get('div#edit-category-modal-div').should('be.visible')
      cy.get('textarea[name="description"]').should('have.value', description)
    })

    it('should create a new master category with name and color', () => {
      cy.get('div#master-calendar-accordion-item').should('be.visible')
      cy.get('div[id="category-item-20"]').should('not.exist')
      cy.get('button#create-category-btn').click()
      cy.get('div#create-category-modal-div').should('be.visible')
      cy.get('input[name="name"]').type('new cat')
      cy.get('div[title="#f87171"]').click()
      submitNewCategory()
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

    it('should create a new master category with name and icon select', () => {
      cy.get('div#master-calendar-accordion-item').should('be.visible')
      cy.get('div[id="category-item-20"]').should('not.exist')
      cy.get('button#create-category-btn').click()
      cy.get('div#create-category-modal-div').should('be.visible')
      cy.get('input[name="name"]').type('new cat')
      let iconSvgPath =
        'M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z'
      cy.get('div[id="icon-picker"]').children().first().click()
      submitNewCategory()
      cy.get('div#master-calendar-accordion-item').eq(0).children().should('contain', 'new cat')
      cy.get('div[id="category-item-20"]').should('exist')
      cy.get('input[id="checkbox-20"]')
        .parent()
        .children('label')
        .children('span')
        .children('svg')
        .children('path')
        .invoke('attr', 'd')
        .should('eq', iconSvgPath)
    })

    it('should create a new master category with name and icon search', () => {
      cy.get('div#master-calendar-accordion-item').should('be.visible')
      cy.get('div[id="category-item-20"]').should('not.exist')
      cy.get('button#create-category-btn').click()
      cy.get('div#create-category-modal-div').should('be.visible')
      cy.get('input[name="name"]').type('new cat')
      cy.get('div[id="icon-search"]').click()
      cy.get('input[id="search-bar"]').type('airplane{enter}')
      cy.get('div[id="icon-result"]').children().first().children().first().click()
      cy.get('body').click(0, 0)
      let iconSvgPath =
        'M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Zm.894.448C7.111 2.02 7 2.569 7 3v4a.5.5 0 0 1-.276.447l-5.448 2.724a.5.5 0 0 0-.276.447v.792l5.418-.903a.5.5 0 0 1 .575.41l.5 3a.5.5 0 0 1-.14.437L6.708 15h2.586l-.647-.646a.5.5 0 0 1-.14-.436l.5-3a.5.5 0 0 1 .576-.411L15 11.41v-.792a.5.5 0 0 0-.276-.447L9.276 7.447A.5.5 0 0 1 9 7V3c0-.432-.11-.979-.322-1.401C8.458 1.159 8.213 1 8 1c-.213 0-.458.158-.678.599Z'
      submitNewCategory()
      cy.get('div#master-calendar-accordion-item').eq(0).children().should('contain', 'new cat')
      cy.get('div[id="category-item-20"]').should('exist')
      cy.get('input[id="checkbox-20"]')
        .parent()
        .children('label')
        .children('span')
        .children('svg')
        .children('path')
        .invoke('attr', 'd')
        .should('eq', iconSvgPath)
    })
  })
})
export {}
