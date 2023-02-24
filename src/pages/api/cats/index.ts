import prisma from '@/prisma/prismadb'
import { getCategories } from '@/prisma/queries'
import { Entry } from '@prisma/client'
import dayjs from 'dayjs'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      const categories = await getCategories()
      return res.status(200).json(categories)
    case 'PUT':
      const nameExists = await prisma.category.findFirst({
        where: { name: req.body.name, NOT: { id: req.body.id } }
      })
      if (nameExists) {
        return res.status(409).send('category name conflicting other category')
      }
      try {
        req.body.oldEntries.map(async (Entry: Entry) => {
          await prisma.entry.deleteMany({
            where: { AND: [{ id: Entry.id }, { categoryId: req.body.id }] }
          })
        })
        const edited_category = await prisma.category.update({
          where: { id: req.body.id },
          data: {
            name: req.body.name,
            description: req.body.description,
            color: req.body.color,
            isMaster: req.body.isMaster,
            icon: req.body.icon,
            cron: req.body.cron,
            startDate: req.body.startDate ? dayjs(req.body.startDate).toISOString() : null,
            endDate: req.body.endDate ? dayjs(req.body.endDate).toISOString() : null,
            entries: {
              createMany: {
                data: req.body.dates.map((date: string) => ({
                  date: dayjs(date).toISOString()
                }))
              }
            }
          },
          include: {
            entries: true
          }
        })
        return res.status(200).json(edited_category)
      } catch (error) {
        console.error(error)
        return res.status(404).send('category does not exist')
      }
    case 'POST':
      const categoryExists = await prisma.category.findFirst({
        where: { name: req.body.name }
      })
      if (!categoryExists) {
        console.log(dayjs(req.body.startDate).toISOString(), ' ', dayjs(req.body.endDate).toISOString())
        const new_category = await prisma.category.create({
          data: {
            name: req.body.name,
            description: req.body.description,
            color: req.body.color,
            isMaster: req.body.isMaster,
            creatorId: req.body.creatorId,
            icon: req.body.icon,
            cron: req.body.cron,
            startDate: req.body.startDate ? dayjs(req.body.startDate).toISOString() : null,
            endDate: req.body.endDate ? dayjs(req.body.endDate).toISOString() : null,
            entries: {
              createMany: {
                data: req.body.dates.map((date: string) => ({
                  date: dayjs(date).toISOString()
                }))
              }
            }
          },
          include: {
            entries: true
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
