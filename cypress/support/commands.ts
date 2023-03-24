// set a cookie with a valid session token to mock user login
Cypress.Commands.add('login', (type: 'admin' | 'pleb') => {
  cy.setCookie('next-auth.session-token', Cypress.env(`${type}_token`.toUpperCase()))
})

// reset prisma db and seed it with test data
Cypress.Commands.add('resetDb', () => {
  cy.exec('yarn prisma:reset --force')
})

// checks if consecutive days have the new icon then check if the next 7-consecutivedays do not have the new icon
//      checks only the first 28 days of each month (works in 2023 right now, not sure about others)
Cypress.Commands.add('checkWeeklyConsecutiveDays', (consecutiveDays: number) => {
  const daysToSkip = 7 - consecutiveDays
  const startingDate = 0

  function checkDay(day: number, skipDaysLeft: number, consDaysLeft: number) {
    if (day >= 335) return

    const currentSelectedDateId = `2023-${day}`
    const currentDivId = `div#${currentSelectedDateId}`

    cy.get(currentDivId).within(() => {
      if (consDaysLeft > 0) {
        cy.get('span#newWeeklyCat-icon').should('exist')
      } else {
        cy.get('span#newWeeklyCat-icon').should('not.exist')
      }
    })

    cy.wait(1).then(() => {
      if (consDaysLeft > 0) {
        checkDay(day + 12, skipDaysLeft, consDaysLeft - 1)
      } else if (skipDaysLeft > 0) {
        if (skipDaysLeft - 1 == 0) {
          checkDay(day + 12, daysToSkip, consecutiveDays)
        } else {
          checkDay(day + 12, skipDaysLeft - 1, consDaysLeft)
        }
      } else {
        checkDay(startingDate + 1, daysToSkip, consecutiveDays)
      }
    })
  }

  checkDay(startingDate, daysToSkip, consecutiveDays)
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(type: 'admin' | 'pleb'): Chainable<Element>
      resetDb(): Chainable<Element>
      checkWeeklyConsecutiveDays: (consecutiveDays: number) => void
    }
  }
}

export {}
