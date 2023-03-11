import '@testing-library/jest-dom'
import { prismaMock } from '@/prisma/singleton'
import { createRequest, createResponse } from 'node-mocks-http'
import * as jwt from 'next-auth/jwt'
import dates, { generateICal } from '@/pages/api/dates/export'
import ical from 'ical-generator'
import dayjs from 'dayjs'

const mock_body = [
  {
    id: 1,
    name: 'Birthday',
    description: 'abc',
    color: '#000000',
    isMaster: false,
    cron: null,
    startDate: null,
    endDate: null,
    creator: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@ad.com',
      isAdmin: true
    },
    entries: [
      {
        id: 1,
        date: new Date('2022-03-15T10:30:00.000Z'),
        isRepeating: false,
        categoryId: 1
      }
    ],
    icon: '\u1919'
  }
]

describe('/api/dates/export', () => {
  describe('GET', () => {
    it('GET should return a 200 status code', async () => {
      // create a mock request and response
      const req = createRequest({
        method: 'GET',
        url: '/dates/export'
      })
      const res = createResponse()

      const mock_token = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@ad.com',
        isAdmin: true
      }

      jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

      prismaMock.category.findMany.mockImplementation((): any => {
        return Promise.resolve(mock_body)
      })

      // call the /api/dates/export endpoint
      await dates(req, res)

      // check the status code and start of data
      expect(res._getStatusCode()).toBe(200)
      expect(res.getHeader('Content-Type')).toBe('text/calendar')
      expect(res.getHeader('Content-Disposition')).toBe('attachment; filename=yojana.ics')
      expect(res._getData()).toMatch(/BEGIN:VCALENDAR/)
    })
  })

  it('should return a 405 status code when invalid method', async () => {
    const req = createRequest({
      method: 'PATCH',
      url: '/dates/export'
    })
    const res = createResponse()

    await dates(req, res)

    expect(res._getStatusCode()).toBe(405)
    expect(res._getData()).toBe('Method Not Allowed')
  })
})

describe('test generateICal function', () => {
  it('should generate a calendar with events for each category entry', () => {
    const expectedCalendar = ical({ name: 'Yojana Calendar' })
    expectedCalendar.createEvent({
      start: dayjs('2022-03-15T10:30:00.000Z').toDate(),
      allDay: true,
      summary: 'Birthday',
      description: 'abc',
      categories: [{ name: 'Birthday' }],
      organizer: { name: 'John Doe', email: 'john.doe@ad.com' }
    })

    const generatedCalendar = generateICal(mock_body)
    expect(generatedCalendar.name()).toEqual('Yojana Calendar')
    expect(generatedCalendar.events().length).toEqual(1)
    expect(generatedCalendar.events()[0].start()).toEqual(new Date('2022-03-15T10:30:00.000Z'))
    expect(generatedCalendar.events()[0].allDay()).toEqual(true)
    expect(generatedCalendar.events()[0].summary()).toEqual('Birthday')
    expect(generatedCalendar.events()[0].categories().toString()).toEqual('Birthday')
    expect(generatedCalendar.events()[0].organizer()).toEqual({ name: 'John Doe', email: 'john.doe@ad.com' })
  })
})
