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
    cy.get(`div#category-item-${categoryItemNumber}`).find(`input[type="checkbox"]`).uncheck()
    cy.get(`div#category-item-${categoryItemNumber}`).find(`input[type="checkbox"]`).should('be.unchecked')
  }

  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should create and uncheck 1 category in master accordion', () => {
      checkMasterCategory(20)
    })

    it('should create and uncheck 1 category in personal accordion', () => {
      checkPersonalCategory(20)
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

    it('should create and uncheck 1 category in personal accordion', () => {
      checkPersonalCategory(20)
    })
  })
})

export {}
