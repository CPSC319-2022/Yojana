// set a cookie with a valid session token to mock user login
Cypress.Commands.add('login', (type: 'admin' | 'pleb') => {
  cy.setCookie('next-auth.session-token', Cypress.env(`${type}_token`.toUpperCase()))
})

// reset prisma db and seed it with test data
Cypress.Commands.add('resetDb', () => {
  cy.exec('yarn prisma:reset --force')
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(type: 'admin' | 'pleb'): Chainable<Element>
      resetDb(): Chainable<Element>
    }
  }
}

export {}
