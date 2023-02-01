import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prismadb'
import { getToken } from 'next-auth/jwt'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed')
  } else {
    const token = await getToken({ req })
    const { id } = req.query

    if (!token?.isAdmin && token?.id !== id) {
      res.status(401).send('Unauthorized')
    } else {
      const { id } = req.query
      if (!id) return res.status(400).send('Bad Request')
      if (typeof id !== 'string') return res.status(400).send('Bad Request')

      const user = await prisma.user.findUnique({
        where: {
          id: id
        }
      })

      if (!user) return res.status(404).send('Not Found')
      return res.status(200).json(user)
    }
  }
}

export default handler
