import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prismadb'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed')
  } else {
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
}

export default handler
