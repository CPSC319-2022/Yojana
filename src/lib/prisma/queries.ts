import prisma from '@/prisma/prismadb'

const selectAll = {
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

// returns all master categories and personal categories for a user without the entries included
export const getCategoriesWithoutEntries = async (creatorId?: string) => {
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
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      isMaster: true,
      cron: true,
      startDate: true,
      endDate: true,
      creator: true,
      icon: true
    }
  })
}

// returns all master categories and personal categories for a user for a given year (if provided)
export const getCategories = async (creatorId?: string, year?: number) => {
  return prisma.category.findMany({
    where: {
      OR: [
        {
          creatorId: creatorId
        },
        {
          isMaster: true
        }
      ],
      entries: year
        ? {
            some: {
              date: {
                gte: new Date(year, 0, 1),
                lte: new Date(year, 11, 31)
              }
            }
          }
        : undefined
    },
    select: selectAll
  })
}

// returns all master categories
export const getMasterCategories = async () => {
  return prisma.category.findMany({
    where: {
      isMaster: true
    },
    select: selectAll
  })
}

// returns all personal categories for a user
export const getPersonalCategories = async (creatorId: string) => {
  return prisma.category.findMany({
    where: {
      creatorId: creatorId,
      isMaster: false
    },
    select: selectAll
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
    select: selectAll
  })
}
