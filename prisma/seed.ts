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
        name: 'Statutory Holiday',
        description: 'Statutory holidays in Canada',
        color: tcolors.emerald[500],
        isMaster: true,
        icon: 'Circle'
      },
      {
        name: 'Month End',
        description: 'Month End',
        color: tcolors.red[500],
        isMaster: true,
        icon: 'XLg'
      },
      {
        name: 'Plan',
        description: 'Plan',
        color: tcolors.orange[500],
        isMaster: true,
        icon: 'Hexagon'
      },
      {
        name: 'EPSP',
        description: 'Shareholder meeting',
        color: tcolors.violet[500],
        isMaster: true,
        icon: 'App'
      },
      {
        name: 'Group Board Meeting',
        description: 'Group Board Meeting',
        color: tcolors.amber[500],
        isMaster: true,
        icon: 'ChevronUp'
      },
      {
        name: 'ASHCO Board Meeting',
        description: 'ASHCO Board Meeting',
        color: tcolors.fuchsia[500],
        isMaster: true,
        icon: 'ChevronDoubleUp'
      },
      {
        name: 'Management Meeting',
        description: 'Management Meeting',
        color: tcolors.fuchsia[500],
        isMaster: true,
        icon: 'Diamond'
      },
      {
        name: 'Expense Cutoff',
        description: 'Expense Cutoff',
        color: tcolors.gray[500],
        isMaster: true,
        icon: 'Bank'
      },
      {
        name: 'Annual General Meeting',
        description: 'Annual General Meeting',
        color: tcolors.yellow[500],
        isMaster: true,
        icon: 'MegaphoneFill'
      },
      {
        name: 'Preliminary Forecast',
        description: 'Preliminary Forecast',
        color: tcolors.indigo[500],
        isMaster: true,
        icon: 'Thunderbolt'
      },
      {
        name: 'Forecast',
        description: 'Forecast',
        color: tcolors.cyan[500],
        isMaster: true,
        icon: 'Braces'
      },
      {
        name: 'UBAR Distribution',
        description: 'UBAR Distribution',
        color: tcolors.lime[500],
        isMaster: true,
        icon: 'ArrowReturnLeft'
      },
      {
        name: 'Office Closed',
        description: 'Office Closed',
        color: tcolors.sky[500],
        isMaster: true,
        icon: 'CloudFill'
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
    return { date: date.split(',')[0], isRecurring: false }
  })
}

// seed the database
const seed = async () => {
  let promises: any[] = []
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

  await Promise.all(promises)

  promises = []

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
                // create 100 random dates for each category
                // data: generateRandomDates(new Date(2022, 0, 1), new Date(2024, 11, 31), 100, category.name)
                data: []
              }
            }
          }
        })
      )
    })
  })

  // wait for all promises to resolve in the order they were created
  await prisma.$transaction(promises)
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
