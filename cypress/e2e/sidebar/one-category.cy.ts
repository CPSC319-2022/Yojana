describe('View all category', () => {
  const checkPersonalCategory = () => {
    cy.get('div[id="category-item-20"]').should('not.exist')
    cy.get('button#create-category-btn').click()
    cy.get('div#create-category-modal-div').should('be.visible')
    cy.get('input[name="name"]').type('new cat')
    cy.get('div#create-category-modal-div').scrollTo('bottom')
    cy.get('button#create-category-submit-btn').click()
    cy.get('div#sidebar').scrollTo('bottom')
    cy.get('div#personal-calendar-accordion-item').eq(0).children().should('contain', 'new cat')
    cy.get(`div#category-item-20`).should('exist')
    cy.get(`div#category-item-20`).find(`input[type="checkbox"]`).should('be.checked')
  }

  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should display 1 category in master accordion', () => {
      cy.get('div[id="category-item-20"]').should('not.exist')
      cy.get('button#create-category-btn').click()
      cy.get('div#create-category-modal-div').should('be.visible')
      cy.get('input[name="name"]').type('new cat')
      cy.get('div#create-category-modal-div').scrollTo('bottom')
      cy.get('button#master-calendar-type-btn').click()
      cy.get('button#create-category-submit-btn').click()
      cy.get('div#sidebar').scrollTo('bottom')
      cy.get('div#personal-calendar-accordion-item').eq(0).children().should('contain', 'new cat')
      cy.get(`div#category-item-20`).should('exist')
      cy.get(`div#category-item-20`).find(`input[type="checkbox"]`).should('be.checked')
    })

    it('should display 1 category in personal accordion', () => {
      checkPersonalCategory()
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

    it('should display 1 category in personal accordion', () => {
      checkPersonalCategory()
    })
  })
})

export {}
