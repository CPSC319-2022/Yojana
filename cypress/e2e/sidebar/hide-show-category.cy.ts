describe('Accordian Drop Down category', () => {
  const checkExist = (number) => {
    cy.get(`div#category-item-${number}`).should('exist')
  }
  const checkNotExist = (number) => {
    cy.get(`div#category-item-${number}`).should('not.exist')
  }

  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
    })

    afterEach(() => {
      cy.resetDb()
    })

    it('should collapse the view when arrow is clicked Master', () => {
      for (let i = 1; i < 14; i++) {
        checkExist(i)
      }
      cy.get('div#master-calendar-accordion-item').find('button').eq(0).click()
      for (let i = 1; i < 14; i++) {
        checkNotExist(i)
      }
    })

    it('should collapse the view when arrow is clicked Personal', () => {
      for (let i = 14; i < 20; i++) {
        checkExist(i)
      }
      cy.get('div#personal-calendar-accordion-item').find('button').eq(0).click()
      for (let i = 14; i < 20; i++) {
        checkNotExist(i)
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

    it('should collapse the view when arrow is clicked Master', () => {
      for (let i = 1; i < 14; i++) {
        checkExist(i)
      }
      cy.get('div#master-calendar-accordion-item').find('button').eq(0).click()
      for (let i = 1; i < 14; i++) {
        checkNotExist(i)
      }
    })
  })
})
export {}
