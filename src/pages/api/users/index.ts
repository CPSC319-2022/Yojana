import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import prisma from '@/lib/prismadb'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      const token = await getToken({ req })
      if (!token?.isAdmin) {
        return res.status(401).send('Unauthorized')
      }
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true
        }
      })
      return res.status(200).json(users)
    default:
      return res.status(405).send('Method Not Allowed')
  }
}

export default handler
