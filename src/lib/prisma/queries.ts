import prisma from '@/prisma/prismadb'

interface GetCategoriesOptions {
  names?: string[]
}

export const getCategories = async (options: GetCategoriesOptions = {}) => {
  const { names = [] } = options
  return await prisma.category.findMany({
    where: {
      name: {
        in: names
      }
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
      entries: true,
      icon: true
    }
  })
}
