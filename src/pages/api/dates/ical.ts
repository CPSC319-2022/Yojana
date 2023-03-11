import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { getCategories } from '@/prisma/queries'
import * as http from 'http'

const { createICal } = require('ical-generator')

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      const token = await getToken({ req })
      if (!token?.isAdmin) {
        return res.status(401).send('Unauthorized')
      }
      const data = await getCategories()
      const server = http.createServer((req, res) => {
        if (req.url === '/ical') {
          res.setHeader('Content-Type', 'text/calendar')
          res.setHeader('Content-Disposition', 'attachment; filename="calendar.ics"')
          const ical = generateICal(data)
          res.end(ical)
        } else {
          res.statusCode = 404
          res.end()
        }
      })
      server.listen(3000, () => {
        console.log('Server listening on port 3000')
      })
      return res.status(200).json(data.entries)
    default:
      return res.status(405).send('Method Not Allowed')
  }
}

function generateICal(categories: any) {
  const eventDataArray: { start: Date; end: Date; summary: any; location: any; description: any }[] = []
  categories.forEach(
    (category: {
      startDate: string | number | Date
      endDate: string | number | Date
      name: any
      description: any
      cron: any
    }) => {
      const eventData = {
        start: new Date(category.startDate),
        end: new Date(category.endDate),
        summary: category.name,
        location: category.description,
        description: category.cron
      }
      eventDataArray.push(eventData)
    }
  )
  // Format the data into iCal format
  return createICal({
    domain: 'yojana.com',
    name: 'Yojana Calendar',
    prodId: '//yojana.com//iCal Generator//EN',
    events: eventDataArray
  })
}

export default handler
