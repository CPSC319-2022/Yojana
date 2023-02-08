import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma/prismadb'
import { getToken } from 'next-auth/jwt'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET': {
      const entries = await prisma.entry.findMany({
        select: {
          id: true,
          date: true,
          categoryId: true
        }
      })
      return res.status(200).json(entries)
    }
    case 'POST': {
      const token = await getToken({ req })
      if (!token?.isAdmin) {
        return res.status(401).json('Unauthorized')
      }
      const { categoryId, dates } = req.body
      if (!categoryId || !dates) return res.status(400).send('Bad Request')

      const numEntries = await prisma.entry.createMany({
        data: dates.map((date: string) => ({
          date: new Date(date),
          categoryId: parseInt(categoryId.toString())
        }))
      })
      return res.status(200).json(numEntries.count)
    }
    default:
      return res.status(405).send('Method Not Allowed')
  }
}

export default handler
