// https://www.prisma.io/docs/guides/database/seed-database
import { PrismaClient } from '@prisma/client'
import tcolors from 'tailwindcss/colors'

const prisma = new PrismaClient()

// data to seed
export const data = [
  {
    id: 'f0b54ab0-366f-45b1-b750-1d5b79f3603c',
    email: 'admin@asaddhorajiwala.com',
    name: 'Admin',
    isAdmin: true,
    categories: [
      {
        name: 'PayDay',
        description: 'This is the day you get paid',
        color: tcolors.green[500],
        isMaster: true,
        icon: '\u0024'
      },
      {
        name: 'Holiday',
        description: 'Statuary holidays',
        color: tcolors.red[500],
        isMaster: true,
        icon: '\u25A3'
      },
      {
        name: 'Work from home',
        description: 'Work from home',
        color: tcolors.sky[500],
        isMaster: true,
        icon: '\u2b1f'
      },
      {
        name: 'Shareholder meeting',
        description: 'Shareholder meeting',
        color: tcolors.violet[500],
        isMaster: true,
        icon: '\u2660'
      },
      {
        name: 'Vacation',
        description: 'Corporate retrieve',
        color: tcolors.slate[900],
        isMaster: true,
        icon: '\u2708'
      },
      {
        name: 'Birthday',
        description: 'List of Birthdays',
        color: tcolors.amber[500],
        isMaster: true,
        icon: '\uD83D\uDD6F'
      }
    ]
  }
]

// generate around n random dates between start and end dates
const generateRandomDates = (start: Date, end: Date, n: number, category: string) => {
  const set = new Set<string>()
  for (let i = 0; i < n; i++) {
    // generate a random date between start and end dates
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    // set the time to 00:00:00:000, so that we don't have duplicate dates
    date.setHours(0, 0, 0, 0)
    // add category name to the date string to ensure that we don't have duplicate dates for a category
    set.add(`${date.toISOString()},${category}}`)
  }
  return Array.from(set).map((date) => {
    // discard the category name
    return { date: date.split(',')[0] }
  })
}

// seed the database
const seed = async () => {
  const promises = []
  // create users
  promises.push(
    ...data.map((user) => {
      return prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin
        }
      })
    })
  )

  // create categories and dates
  data.forEach((user) => {
    user.categories.forEach((category) => {
      promises.push(
        prisma.category.create({
          data: {
            name: category.name,
            description: category.description,
            color: category.color,
            isMaster: category.isMaster,
            creatorId: user.id,
            icon: category.icon,
            entries: {
              createMany: {
                // create around 25 random dates for each category in 2023
                data: generateRandomDates(new Date(2023, 0, 1), new Date(2023, 11, 31), 25, category.name)
              }
            }
          }
        })
      )
    })
  })

  await Promise.all(promises)
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
