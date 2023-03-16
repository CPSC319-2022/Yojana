import prisma from '@/prisma/prismadb'

const select = {
  id: true,
  name: true,
  description: true,
  color: true,
  isMaster: true,
  cron: true,
  startDate: true,
  endDate: true,
  creator: true,
  entries: true,
  icon: true
}

// returns all master categories and personal categories for a user
export const getCategories = async (creatorId?: string) => {
  return prisma.category.findMany({
    where: {
      OR: [
        {
          creatorId: creatorId
        },
        {
          isMaster: true
        }
      ]
    },
    select
  })
}

// returns all master categories
export const getMasterCategories = async () => {
  return prisma.category.findMany({
    where: {
      isMaster: true
    },
    select
  })
}

// returns all personal categories for a user
export const getPersonalCategories = async (creatorId: string) => {
  return prisma.category.findMany({
    where: {
      creatorId: creatorId,
      isMaster: false
    },
    select
  })
}

// returns all categories with the given ids
export const getCategoriesById = async (categoryIds: number[]) => {
  return prisma.category.findMany({
    where: {
      id: {
        in: categoryIds
      }
    },
    select
  })
}
