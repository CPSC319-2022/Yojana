describe('Create Category With Name', () => {
  const createNewPersonalCategory = () => {
    cy.get('div#personal-calendar-accordion-item').should('not.exist')
    cy.get('div[id="category-item-14"]').should('not.exist')
    cy.get('button#create-category-btn').click()
    cy.get('div#create-category-modal-div').should('be.visible')
    cy.get('input[name="name"]').type('new cat')
    cy.get('div#create-category-modal-div').scrollTo('bottom')
    cy.get('button#create-category-submit-btn').click()
    cy.get('div#sidebar').scrollTo('bottom')
    cy.get('div#personal-calendar-accordion-item').eq(0).children().should('contain', 'new cat')
    cy.get('div[id="category-item-14"]').should('exist')
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
      cy.get('div[id="category-item-14"]').should('not.exist')
      cy.get('button#create-category-btn').click()
      cy.get('div#create-category-modal-div').should('be.visible')
      cy.get('input[name="name"]').type('new cat')
      cy.get('div#create-category-modal-div').scrollTo('bottom')
      cy.get('button#master-calendar-type-btn').click()
      cy.get('button#create-category-submit-btn').click()
      cy.get('div#sidebar').scrollTo('bottom')
      cy.get('div#master-calendar-accordion-item').eq(0).children().should('contain', 'new cat')
      cy.get('div[id="category-item-14"]').should('exist')
    })

    it('should create a new personal category', () => {
      createNewPersonalCategory()
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
      cy.get('div[id="category-item-14"]').should('not.exist')
      cy.get('button#create-category-btn').click()
      cy.get('div#create-category-modal-div').should('be.visible')
      cy.get('div#create-category-modal-div').scrollTo('bottom')
      cy.get('button#master-calendar-type-btn').should('not.exist')
    })

    it('should create a new personal category', () => {
      createNewPersonalCategory()
    })
  })
})

export {}
