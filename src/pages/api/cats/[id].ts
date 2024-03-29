import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma/prismadb'
import { getToken } from 'next-auth/jwt'

/**
 * route: /api/cats/[id]
 *
 * GET: Get category by id
 * DELETE: Delete category by id
 *
 * @param req
 * @param res
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const categoryId = Number(req.query.id)
  const { method } = req
  switch (method) {
    case 'GET':
      // Get category data from the database. Useful for specific category details and form pre-population.
      try {
        const category = await prisma.category.findUnique({
          where: { id: categoryId }
        })
        category ? res.status(200).json(category) : res.status(404).send('Not Found')
      } catch (e) {
        res.status(409).send('There was an error retrieving the category')
      }
      return res
    case 'DELETE':
      const token = await getToken({ req })
      // Only admins can delete master categories
      if (req.body.isMaster && !token?.isAdmin) {
        return res.status(401).send('Unauthorized')
      }
      // Delete data from your database
      const categoryExists = await prisma.category.findFirst({
        where: { id: categoryId }
      })
      if (categoryExists) {
        try {
          await prisma.entry.deleteMany({
            where: { categoryId: categoryId }
          })
          let deletedCategory = await prisma.category.delete({
            where: { id: categoryId }
          })
          return res.status(200).json(deletedCategory)
        } catch (e) {
          return res.status(409).send('There was an error deleting the category')
        }
      } else {
        return res.status(404).send('category does not exist')
      }
    default:
      res.setHeader('Allow', ['GET', 'DELETE'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default handler
