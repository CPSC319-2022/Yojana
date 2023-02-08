import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma/prismadb'
import { getToken } from 'next-auth/jwt'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      const token = await getToken({ req })
      const { id } = req.query

      if (!token?.isAdmin && token?.id !== id) {
        return res.status(401).send('Unauthorized')
      }
      if (!id) return res.status(400).send('Bad Request')
      if (typeof id !== 'string') return res.status(400).send('Bad Request')

      try {
        const user = await prisma.user.findUniqueOrThrow({
          where: {
            id: id
          }
        })
        return res.status(200).json(user)
      } catch (error) {
        return res.status(404).send('Not Found')
      }
    default:
      return res.status(405).send('Method Not Allowed')
  }
}

export default handler
