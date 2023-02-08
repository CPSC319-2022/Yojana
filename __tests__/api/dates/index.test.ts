import '@testing-library/jest-dom'
import { prismaMock } from '@/prisma/singleton'
import { createRequest, createResponse } from 'node-mocks-http'
import * as jwt from 'next-auth/jwt'
import dates from '@/pages/api/dates'
import { Entry } from '@prisma/client'

describe('/api/dates', () => {
  describe('GET', () => {
    it('GET should return a 200 status code', async () => {
      // create a mock request and response
      const req = createRequest({
        method: 'GET',
        url: '/dates'
      })
      const res = createResponse()

      const mock_token = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@ad.com',
        isAdmin: true
      }

      // mock getToken from next-auth/jwt
      jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

      const mock_dates: Entry[] = [
        {
          id: 1,
          date: new Date(),
          categoryId: 1
        },
        {
          id: 2,
          date: new Date(),
          categoryId: 2
        }
      ]

      //mock prisma.user.findMany()
      prismaMock.entry.findMany.mockResolvedValue(mock_dates)

      // call the /api/dates endpoint
      await dates(req, res)

      // check the status code and data
      expect(res._getStatusCode()).toBe(200)
      expect(res._getData()).toBe(JSON.stringify(mock_dates))
    })
  })

  describe('POST', () => {
    it('should return 200 status code when dates are created', async () => {
      // create a mock request and response
      const req = createRequest({
        method: 'POST',
        url: '/dates',
        body: {
          categoryId: 1,
          dates: [Date.now()]
        }
      })
      const res = createResponse()

      const mock_token = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@ad.com',
        isAdmin: true
      }

      // mock getToken from next-auth/jwt
      jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

      // mock BatchPayload
      const mock_batchPayload = {
        count: 1
      }

      //mock prisma.user.findMany()
      prismaMock.entry.createMany.mockResolvedValue(mock_batchPayload)

      // call the /api/users endpoint
      await dates(req, res)

      // check the status code and data
      expect(res._getStatusCode()).toBe(200)
      expect(res._getData()).toBe(JSON.stringify(mock_batchPayload.count))
    })

    it('should return a 401 status code when user is not an admin', async () => {
      // create a mock request and response
      const req = createRequest({
        method: 'POST',
        url: '/dates',
        body: {
          categoryId: 1,
          dates: [Date.now()]
        }
      })
      const res = createResponse()

      const mock_token = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@ad.com',
        isAdmin: false
      }

      // mock getToken from next-auth/jwt
      jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

      // call the /api/users endpoint
      await dates(req, res)

      // check the status code and data
      expect(res._getStatusCode()).toBe(401)
      expect(res._getData()).toBe(JSON.stringify('Unauthorized'))
    })

    it('should return a 400 status code when missing body', async () => {
      // create a mock request and response
      const req = createRequest({
        method: 'POST',
        url: '/dates'
      })
      const res = createResponse()

      const mock_token = {
        id: '1',
        name: 'John Doe',
        email: 'john@doe.com',
        isAdmin: true
      }

      // mock getToken from next-auth/jwt
      jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

      // call the /api/users endpoint
      await dates(req, res)

      // check the status code and data
      expect(res._getStatusCode()).toBe(400)
      expect(res._getData()).toBe('Bad Request')
    })
  })

  it('should return a 405 status code when invalid method', async () => {
    const req = createRequest({
      method: 'PATCH',
      url: '/dates'
    })
    const res = createResponse()

    await dates(req, res)

    expect(res._getStatusCode()).toBe(405)
    expect(res._getData()).toBe('Method Not Allowed')
  })
})
