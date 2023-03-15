import { NextApiRequest, NextApiResponse } from 'next'
import ical, { ICalCalendar } from 'ical-generator'
import { CategoryFull } from '@/types/prisma'
import dayjs from 'dayjs'
import z from 'zod'
import { getCategoriesById, getMasterCategories, getPersonalCategories } from '@/prisma/queries'
import { getToken } from 'next-auth/jwt'

const schema = z.object({
  master: z.union([z.literal('true'), z.literal('false')]).optional(),
  userID: z.string().optional(),
  categories: z
    .string()
    .transform((value) => {
      const ids = value.split(',').map((id) => parseInt(id))
      // check if all ids are numbers and throw an error if not
      if (ids.some((id) => isNaN(id))) {
        throw new Error('Invalid category ids')
      }
      return ids
    })
    .optional()
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      try {
        const { master, userID, categories } = schema.parse(req.query)
        let calendar: ICalCalendar

        if (master === 'true') {
          // if master is true, we return all master categories
          calendar = generateICal(await getMasterCategories())
        } else if (master === 'false') {
          // if master is false, we return all personal categories for the given user
          if (userID === undefined) {
            return res.status(400).send('Bad Request')
          }
          const token = await getToken({ req })

          // check if the user is authorized to access the personal categories of the given user
          // users can only access their own personal categories
          // admins can access personal categories of any user
          if (token?.id !== userID && token?.isAdmin !== true) {
            return res.status(401).send('Unauthorized')
          }

          calendar = generateICal(await getPersonalCategories(userID))
        } else if (categories === undefined) {
          // if categories is undefined, we return a bad request
          return res.status(400).send('Bad Request')
        } else {
          // if master is not defined, we return all categories with the given ids
          calendar = generateICal(await getCategoriesById(categories))
        }

        res.setHeader('Content-Type', 'text/calendar')
        res.setHeader('Content-Disposition', 'attachment; filename=yojana.ics')
        return res.status(200).send(calendar.toString())
      } catch (e) {
        return res.status(400).send('Bad Request')
      }
    default:
      return res.status(405).send('Method Not Allowed')
  }
}

export const generateICal = (categories: CategoryFull[]) => {
  const calendar = ical({ name: 'Yojana Calendar' })
  if (categories) {
    categories.forEach(({ entries, name, description, creator }) => {
      entries.forEach(({ date }) => {
        calendar.createEvent({
          start: dayjs(date).toDate(),
          allDay: true,
          summary: name,
          description: description,
          categories: [{ name: name }],
          organizer: { name: creator.name, email: creator.email }
        })
      })
    })
  }
  return calendar
}

export default handler
