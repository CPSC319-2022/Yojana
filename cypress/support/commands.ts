Cypress.Commands.add('login', (type: 'admin' | 'pleb') => {
  cy.setCookie('next-auth.session-token', Cypress.env('session-token')[type])
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(type: 'admin' | 'pleb'): Chainable<Element>
    }
  }
}

export {}
