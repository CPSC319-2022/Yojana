import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { getCategories } from '@/prisma/queries'
import ical from 'ical-generator'
import { CategoryFull } from '@/types/prisma'
import dayjs from 'dayjs'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      const token = await getToken({ req })
      if (!token?.isAdmin) {
        return res.status(401).send('Unauthorized')
      }
      const calendar = generateICal(await getCategories())
      res.setHeader('Content-Type', 'text/calendar')
      res.setHeader('Content-Disposition', 'attachment; filename=yojana.ics')
      res.setHeader('Content-Length', calendar.toString().length)
      return res.status(200).send(calendar.toString())
    default:
      return res.status(405).send('Method Not Allowed')
  }
}

const generateICal = (categories: CategoryFull[]) => {
  const calendar = ical({ name: 'Yojana Calendar' })
  categories.forEach(({ entries, name, description, creator }) => {
    entries.forEach(({ date }) => {
      calendar.createEvent({
        start: dayjs(date).startOf('day').toDate(),
        allDay: true,
        summary: name,
        description: description,
        categories: [{ name: name }],
        organizer: { name: creator.name, email: creator.email }
      })
    })
  })
  return calendar
}

export default handler
