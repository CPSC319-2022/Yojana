/*
 *  This component tests the side bar, it ensures that when the hide button is pressed
 *  the accordion collapses and when check again the accordion is expanded
 */

describe('Accordian Drop Down category', () => {
  const checkExist = (number: number) => {
    cy.get(`div#category-item-${number}`).should('exist')
  }
  const checkNotExist = (number: number) => {
    cy.get(`div#category-item-${number}`).should('not.exist')
  }

  describe('admin', () => {
    beforeEach(() => {
      cy.login('admin')
      cy.visit('/')
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
