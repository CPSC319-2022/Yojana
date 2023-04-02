import prisma from '@/prisma/prismadb'
import { getCategories } from '@/prisma/queries'
import dayjs from 'dayjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Entry } from '@prisma/client'
import { getToken } from 'next-auth/jwt'

/**
 * route: /api/cats
 *
 * GET: Returns all categories (and their entries and their creator)
 * PUT: Edits a category
 * POST: Creates a new category
 *
 * @param req
 * @param res
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      const categories = await getCategories()
      return res.status(200).json(categories)
    case 'PUT': {
      const token = await getToken({ req })
      // Only admins can edit master categories
      if (req.body.isMaster && !token?.isAdmin) {
        return res.status(401).send('Unauthorized')
      }
      try {
        const [, editedCategory] = await prisma.$transaction([
          prisma.entry.deleteMany({
            where: {
              id: {
                in: req.body.toDelete.map((date: Entry) => date.id)
              },
              categoryId: req.body.id
            }
          }),
          prisma.category.update({
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
                  data: req.body.dates.map(
                    ({ date, isRecurring = false }: { date: string; isRecurring?: boolean }) => ({
                      date: dayjs(date).toISOString(),
                      isRecurring: isRecurring
                    })
                  ),
                  skipDuplicates: true
                }
              }
            },
            include: {
              entries: true
            }
          })
        ])
        return res.status(200).json(editedCategory)
      } catch (error) {
        return res.status(404).send('category does not exist')
      }
    }
    case 'POST': {
      const token = await getToken({ req })
      // Only admins can create master categories
      if (req.body.isMaster && !token?.isAdmin) {
        return res.status(401).send('Unauthorized')
      }
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
              data: req.body.dates.map(({ date, isRecurring = false }: { date: string; isRecurring?: boolean }) => ({
                date: dayjs(date).toISOString(),
                isRecurring: isRecurring
              })),
              skipDuplicates: true
            }
          }
        },
        include: {
          entries: true
        }
      })
      return res.status(201).json(new_category)
    }
    default:
      return res.status(405).send('Method Not Allowed')
  }
}

export default handler
