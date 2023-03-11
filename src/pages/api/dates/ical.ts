import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { getCategories } from '@/prisma/queries'
import * as http from 'http'
import ical from 'ical-generator'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      const token = await getToken({ req })
      if (!token?.isAdmin) {
        return res.status(401).send('Unauthorized')
      }
      const data = await getCategories()
      const ical = generateICal(data)
      http
        .createServer((req, res) => {
          ical.serve(res)
          console.log()
        })
        .listen(8080, '127.0.0.1', () => {
          console.log('Server running at http://127.0.0.1:8080/')
        })
      return res.status(200).json(data.entries)
    default:
      return res.status(405).send('Method Not Allowed')
  }
}

function generateICal(categories: any) {
  const icalendar = ical({ name: 'yojana' })
  const allEventData: any[] = []
  categories.forEach((category: { name: any; description: any; entries: any; cron: any }) => {
    const dates = category.entries
    dates.forEach((entry: { date: any }) => {
      const eventData = {
        start: entry.date,
        end: entry.date,
        summary: category.name,
        location: category.description,
        description: category.cron
      }
      allEventData.push(eventData)
    })
  })

  allEventData.forEach((eventData) => {
    icalendar.createEvent({
      start: eventData.start,
      end: eventData.end,
      summary: eventData.summary,
      location: eventData.location,
      description: eventData.description
    })
  })
  return icalendar
}

export default handler
