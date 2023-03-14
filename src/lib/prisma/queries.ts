import prisma from '@/prisma/prismadb'

export const getCategories = async (categoryNames?: string[]) => {
  return await prisma.category.findMany({
    where: {
      name: {
        in: categoryNames
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
