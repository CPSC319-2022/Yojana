import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prismadb'

type Category = Prisma.CategoryGetPayload<{
  select: {
    id: true
    name: true
    description: true
    color: true
    isMaster: true
    creator: true
    dates: true
  }
}>[]

const handler = async (req: NextApiRequest, res: NextApiResponse<Category>) => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      isMaster: true,
      creator: true,
      dates: true
    }
  })
  res.status(200).json(categories)
}

export default handler
