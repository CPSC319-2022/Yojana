import prisma from '@/lib/prismadb'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
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
      return res.status(200).json(categories)
    case 'PUT':
      const nameExists = await prisma.category.findFirst({
        where: { name: req.body.name }
      })
      if (nameExists) {
        return res.status(409).send('category name conflicting other category')
      }
      try {
        const edited_category = await prisma.category.update({
          where: { id: req.body.id },
          data: {
            // id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            color: req.body.color,
            isMaster: req.body.isMaster,
            // creatorId: req.body.creatorId,
            dates: req.body.dates
          }
        })
        return res.status(200).json(edited_category)
      } catch (error) {}
      return res.status(404).send('category does not exist')
    case 'POST':
      const categoryExists = await prisma.category.findFirst({
        where: { name: req.body.name }
      })
      if (!categoryExists) {
        const new_category = await prisma.category.create({
          data: {
            // id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            color: req.body.color,
            isMaster: req.body.isMaster,
            creatorId: req.body.creatorId,
            dates: req.body.dates
          }
        })
        return res.status(201).json(new_category)
      } else {
        return res.status(409).send('category name must be unique')
      }
    default:
      return res.status(405).send('Method Not Allowed')
  }
}

export default handler
