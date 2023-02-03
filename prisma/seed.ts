// https://www.prisma.io/docs/guides/database/seed-database
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// data to seed
export const data = [
  {
    id: 'f0b54ab0-366f-45b1-b750-1d5b79f3603c',
    email: 'admin@asaddhorajiwala.com',
    name: 'Admin',
    isAdmin: true,
    categories: [
      { name: 'PayDay', description: 'This is the day you get paid', color: '#ef4444', isMaster: true },
      { name: 'Holiday', description: 'Statuary holidays', color: '#10b981', isMaster: true },
      { name: 'Work from home', description: 'Work from home', color: '#0ea5e9', isMaster: true },
      { name: 'Shareholder meeting', description: 'Shareholder meeting', color: '#8b5cf6', isMaster: true }
    ]
  }
]

// generate n random dates between start and end dates
const generateRandomDates = (start: Date, end: Date, n: number) => {
  return Array.from({ length: n }, () => {
    return {
      date: new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString()
    }
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
            dates: {
              createMany: {
                // create 20 random dates for each category in 2023
                data: generateRandomDates(new Date(2023, 0, 1), new Date(2023, 11, 31), 20)
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
