import prisma from '@/lib/prismadb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req })
  const { id } = req.query
  switch (req.method) {
    case 'GET':
      const categories = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          color: true,
          isMaster: true,
          creator: true,
          entries: true
        }
      })
      return res.status(200).json(categories)
    case 'PUT':
      if (!token?.isAdmin && token?.id !== id) {
        return res.status(401).send('Unauthorized')
      }
      const nameExists = await prisma.category.findFirst({
        where: { name: req.body.name, NOT: { id: req.body.id } }
      })
      if (nameExists) {
        return res.status(409).send('category name conflicting other category')
      }
      try {
        const edited_category = await prisma.category.update({
          where: { id: req.body.id },
          data: {
            name: req.body.name,
            description: req.body.description,
            color: req.body.color,
            isMaster: req.body.isMaster
          }
        })
        return res.status(200).json(edited_category)
      } catch (error) {
        return res.status(404).send('category does not exist')
      }
    case 'POST':
      if (!token?.isAdmin && token?.id !== id) {
        return res.status(401).send('Unauthorized')
      }
      const categoryExists = await prisma.category.findFirst({
        where: { name: req.body.name }
      })
      if (!categoryExists) {
        const new_category = await prisma.category.create({
          data: {
            name: req.body.name,
            description: req.body.description,
            color: req.body.color,
            isMaster: req.body.isMaster,
            creatorId: req.body.creatorId,
            entries: {
              createMany: {
                data: req.body.dates.map((entry: string) => ({ entry }))
              }
            }
          }
        })
        return res.status(201).json(new_category)
      } else {
        return res.status(409).send('category name must be unique')
      }
    case 'DELETE':
      if (!token?.isAdmin && token?.id !== id) {
        return res.status(401).send('Unauthorized')
      }
      const getCategoryToDelete = await prisma.category.findFirst({
        where: { id: req.body.id }
      })
      if (getCategoryToDelete) {
        try {
          const deletedCategory = await prisma.category.delete({
            where: { id: req.body.id }
          })
          return res.status(200).json(deletedCategory)
        } catch (e) {
          return res.status(409).send('There was an error deleting the category')
        }
      } else {
        return res.status(404).send('category does not exist')
      }
    default:
      return res.status(405).send('Method Not Allowed')
  }
}

export default handler
