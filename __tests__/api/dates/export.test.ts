import '@testing-library/jest-dom'
import { prismaMock } from '@/prisma/singleton'
import { createRequest, createResponse } from 'node-mocks-http'
import exportCalendar, { generateICal } from '@/pages/api/dates/export'
import ical from 'ical-generator'
import dayjs from 'dayjs'
import * as jwt from 'next-auth/jwt'

const mock_body = [
  {
    id: 1,
    name: 'Birthday',
    description: 'abc',
    color: '#000000',
    isMaster: false,
    icon: 'birthday-cake',
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
        isRepeating: false
      }
    ]
  }
]

describe('/api/dates/export', () => {
  describe('GET', () => {
    it('GET should return a 200 status code for master calendar', async () => {
      // create a mock request and response
      const req = createRequest({
        method: 'GET',
        url: '/dates/export?master=true',
        query: {
          master: 'true'
        }
      })
      const res = createResponse()

      prismaMock.category.findMany.mockImplementation((): any => {
        return Promise.resolve(mock_body)
      })

      // call the /api/dates/export endpoint
      await exportCalendar(req, res)

      // check the status code and start of data
      expect(res._getStatusCode()).toBe(200)
      expect(res.getHeader('Content-Type')).toBe('text/calendar')
      expect(res.getHeader('Content-Disposition')).toBe('attachment; filename=yojana.ics')
      expect(res._getData()).toMatch(/BEGIN:VCALENDAR/)
    })

    it('GET should return a 200 status code for user calendar', async () => {
      const mock_token = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@ad.com',
        isAdmin: true
      }
      // mock getToken from next-auth/jwt
      jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

      // create a mock request and response
      const req = createRequest({
        method: 'GET',
        url: '/dates/export?master=false&userID=1',
        query: {
          master: 'false',
          userID: mock_token.id
        }
      })

      const res = createResponse()

      prismaMock.category.findMany.mockImplementation((): any => {
        return Promise.resolve(mock_body)
      })

      // call the /api/dates/export endpoint
      await exportCalendar(req, res)

      // check the status code and start of data
      expect(res._getStatusCode()).toBe(200)
      expect(res.getHeader('Content-Type')).toBe('text/calendar')
      expect(res.getHeader('Content-Disposition')).toBe('attachment; filename=yojana.ics')
      expect(res._getData()).toMatch(/BEGIN:VCALENDAR/)
    })

    it('GET should return a 200 status code for user calendar if user is admin', async () => {
      const mock_token = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@ad.com',
        isAdmin: true
      }
      // mock getToken from next-auth/jwt
      jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

      // create a mock request and response
      const req = createRequest({
        method: 'GET',
        url: '/dates/export?master=false&userID=2',
        query: {
          master: 'false',
          userID: '2'
        }
      })

      const res = createResponse()

      prismaMock.category.findMany.mockImplementation((): any => {
        return Promise.resolve(mock_body)
      })

      // call the /api/dates/export endpoint
      await exportCalendar(req, res)

      // check the status code and start of data
      expect(res._getStatusCode()).toBe(200)
      expect(res.getHeader('Content-Type')).toBe('text/calendar')
      expect(res.getHeader('Content-Disposition')).toBe('attachment; filename=yojana.ics')
      expect(res._getData()).toMatch(/BEGIN:VCALENDAR/)
    })

    it('GET should return a 200 status code for filtered calendar', async () => {
      // create a mock request and response
      const req = createRequest({
        method: 'GET',
        url: '/dates/export?categories=1,2',
        query: {
          categories: '1,2'
        }
      })

      const res = createResponse()

      prismaMock.category.findMany.mockImplementation((): any => {
        return Promise.resolve(mock_body)
      })

      // call the /api/dates/export endpoint
      await exportCalendar(req, res)

      // check the status code and start of data
      expect(res._getStatusCode()).toBe(200)
      expect(res.getHeader('Content-Type')).toBe('text/calendar')
      expect(res.getHeader('Content-Disposition')).toBe('attachment; filename=yojana.ics')
      expect(res._getData()).toMatch(/BEGIN:VCALENDAR/)
    })

    it('GET should return a 400 if userID not provided for personal calendar', async () => {
      // create a mock request and response
      const req = createRequest({
        method: 'GET',
        url: '/dates/export?master=false',
        query: {
          master: 'false'
        }
      })

      const res = createResponse()

      // call the /api/dates/export endpoint
      await exportCalendar(req, res)

      // check the status code and start of data
      expect(res._getStatusCode()).toBe(400)
    })

    it('GET should return a 401 if userID does not match token for personal calendar and user is not admin', async () => {
      const mock_token = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@ad.com',
        isAdmin: false
      }
      // mock getToken from next-auth/jwt
      jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

      // create a mock request and response
      const req = createRequest({
        method: 'GET',
        url: '/dates/export?master=false&userID=2',
        query: {
          master: 'false',
          userID: '2'
        }
      })

      const res = createResponse()

      // call the /api/dates/export endpoint
      await exportCalendar(req, res)

      // check the status code and start of data
      expect(res._getStatusCode()).toBe(401)
    })

    it('GET should return a 400 if categories is undefined for filtered calendar', async () => {
      // create a mock request and response
      const req = createRequest({
        method: 'GET',
        url: '/dates/export'
      })

      const res = createResponse()

      // call the /api/dates/export endpoint
      await exportCalendar(req, res)

      // check the status code and start of data
      expect(res._getStatusCode()).toBe(400)
    })

    it('GET should return a 400 if categories is in wrong format', async () => {
      // create a mock request and response
      const req = createRequest({
        method: 'GET',
        url: '/dates/export?categories=1,2,a',
        query: {
          categories: '1,2,a'
        }
      })

      const res = createResponse()

      // call the /api/dates/export endpoint
      await exportCalendar(req, res)

      // check the status code and start of data
      expect(res._getStatusCode()).toBe(400)
    })
  })

  it('should return a 405 status code when invalid method', async () => {
    const req = createRequest({
      method: 'PATCH',
      url: '/dates/export'
    })
    const res = createResponse()

    await exportCalendar(req, res)

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
