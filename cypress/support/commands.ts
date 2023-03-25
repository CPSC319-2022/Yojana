// set a cookie with a valid session token to mock user login
Cypress.Commands.add('login', (type: 'admin' | 'pleb') => {
  cy.setCookie('next-auth.session-token', Cypress.env(`${type}_token`.toUpperCase()))
})

// reset prisma db and seed it with test data
Cypress.Commands.add('resetDb', () => {
  cy.exec('yarn prisma:reset --force')
})

/* 
checks:
  - assert that consecutiveDays have the new icon (span#id or idToSearch)
  - assert that the next daysToBeSkipped or 7-consecutiveDays do not have the new icon 
  - repeat

  - starts with startingDate (expects to start with the new icon), and optionally stops at lastDate
  - iterates using the offset (eg. 0 then 0+offset then 0+2*offset ...)
  - checks only till the first 28 days of each month (works in 2023 right now, not sure about others)
*/
Cypress.Commands.add(
  'checkIconsInDays',
  (
    idToSearch: string,
    startingDate: number,
    consecutiveDays: number,
    daysToBeSkipped: number,
    offset: number,
    lastDate: number = 335,
    targetLastDate: number = 335
  ) => {
    const daysToSkip = daysToBeSkipped > 0 ? daysToBeSkipped : 7 - consecutiveDays

    function checkDay(day: number, skipDaysLeft: number, consDaysLeft: number) {
      if (day > lastDate || day === targetLastDate) return

      const currentSelectedDateId = `2023-${day}`
      const currentDivId = `div#${currentSelectedDateId}`

      cy.get(currentDivId).within(() => {
        if (consDaysLeft > 0) {
          cy.get(idToSearch).should('exist')
        } else {
          cy.get(idToSearch).should('not.exist')
        }
      })

      cy.wait(1).then(() => {
        if (consDaysLeft > 0) {
          checkDay(day + offset, skipDaysLeft, consDaysLeft - 1)
        } else if (skipDaysLeft > 0) {
          if (skipDaysLeft - 1 == 0) {
            checkDay(day + offset, daysToSkip, consecutiveDays)
          } else {
            checkDay(day + offset, skipDaysLeft - 1, consDaysLeft)
          }
        } else {
          checkDay(startingDate + 1, daysToSkip, consecutiveDays)
        }
      })
    }

    checkDay(startingDate, daysToSkip, consecutiveDays)
  }
)

declare global {
  namespace Cypress {
    interface Chainable {
      login(type: 'admin' | 'pleb'): Chainable<Element>
      resetDb(): Chainable<Element>
      checkIconsInDays: (
        idToSearch: string,
        startingDate: number,
        consecutiveDays: number,
        daysToBeSkipped: number,
        offset: number,
        lastDate?: number,
        targetLastDate?: number
      ) => void
    }
  }
}

export {}
