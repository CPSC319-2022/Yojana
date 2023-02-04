import prisma from '@/lib/prismadb'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method == 'POST') {
    const body = req.body
    
    const categoryExists = await prisma.category.findFirst({
      where: { name: body.name },
    })
    // categoryExists ? console.log("HI") : console.log(body.name)
    if (!categoryExists) {
      const new_category = await prisma.category.create({
        data: {
          // id: body.id,
          name: body.name,
          description: body.description,
          color: body.color,
          isMaster: body.isMaster,
          creatorId: body.creatorId,
          dates: body.dates,
        }
      })
      return res.status(201).json(new_category)
    } else {
      return res.status(409).json({
        message: "category name must be unique"
      })
    }

  }

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
