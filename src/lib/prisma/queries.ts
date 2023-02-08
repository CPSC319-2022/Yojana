import prisma from '@/prisma/prismadb'

export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      isMaster: true,
      creator: true,
      entries: true
    }
  })
  return categories
}
