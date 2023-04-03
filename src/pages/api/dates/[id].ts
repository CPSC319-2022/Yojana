import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import prisma from '@/prisma/prismadb'

/**
 * route: /api/dates/[id]
 *
 * delete a date by id
 *
 * DELETE: deleted date
 * @param req
 * @param res
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'DELETE':
      const token = await getToken({ req })
      if (!token?.isAdmin) {
        return res.status(401).send('Unauthorized')
      }

      // get id
      const id = req.query.id

      if (!id) return res.status(400).send('Bad Request')
      if (typeof id !== 'string') return res.status(400).send('Bad Request')
      if (isNaN(parseInt(id))) return res.status(400).send('Bad Request')

      try {
        const entry = await prisma.entry.delete({
          where: {
            id: parseInt(id)
          }
        })
        return res.status(200).json(entry)
      } catch (e) {
        return res.status(404).send('Not Found')
      }
    default:
      return res.status(405).send('Method Not Allowed')
  }
}

export default handler
