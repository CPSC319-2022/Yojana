import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import prisma from '@/lib/prismadb'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed')
  } else {
    const token = await getToken({ req })
    console.log(token)
    if (!token?.isAdmin) {
      res.status(401).send('Unauthorized')
    } else {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true
        }
      })
      res.status(200).json(users)
    }
  }
}

export default handler
