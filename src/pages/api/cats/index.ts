import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prismadb'

type Categories = Prisma.CategoryGetPayload<{
  select: {
    id: true
    name: true
    description: true
    color: true
    isMaster: true
    creator: true
  }
}>[]

const handler = async (req: NextApiRequest, res: NextApiResponse<Categories>) => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      isMaster: true,
      creator: true
    }
  })
  res.status(200).json(categories)
}

export default handler
