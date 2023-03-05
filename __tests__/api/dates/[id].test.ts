import '@testing-library/jest-dom'
import { createRequest, createResponse } from 'node-mocks-http'
import dates from '@/pages/api/dates/[id]'
import { prismaMock } from '@/prisma/singleton'
import * as jwt from 'next-auth/jwt'
import { Entry } from '@prisma/client'

describe('/api/dates/[id]', () => {
  describe('DELETE', () => {
    it('should return a 200 status code when a date is deleted', async () => {
      const idToDelete = 1

      // create a mock request and response
      const req = createRequest({
        method: 'DELETE',
        url: `/dates/${idToDelete}`,
        query: {
          id: idToDelete.toString()
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

      const mock_entry: Entry = {
        isRepeating: false,
        id: idToDelete,
        date: new Date(),
        categoryId: 10
      }

      prismaMock.entry.delete.mockResolvedValue(mock_entry)

      // call the /api/dates/[id] endpoint
      await dates(req, res)

      // check the status code and data
      expect(res._getStatusCode()).toBe(200)
      expect(res._getData()).toBe(JSON.stringify(mock_entry))
    })

    it('should return a 401 status code when a non-admin user tries to delete a date', async () => {
      const idToDelete = 1

      // create a mock request and response
      const req = createRequest({
        method: 'DELETE',
        url: `/dates/${idToDelete}`,
        query: {
          id: idToDelete.toString()
        }
      })
      const res = createResponse()

      const mock_token = {
        id: '1',
        name: 'John Doe',
        email: 'john@doe',
        isAdmin: false
      }

      // mock getToken from next-auth/jwt
      jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

      // call the /api/dates/[id] endpoint
      await dates(req, res)

      // check the status code and data
      expect(res._getStatusCode()).toBe(401)
      expect(res._getData()).toBe('Unauthorized')
    })

    it('should return a 400 status code when id is not provided', async () => {
      // create a mock request and response
      const req = createRequest({
        method: 'DELETE',
        url: `/dates/`,
        query: {}
      })
      const res = createResponse()

      const mock_token = {
        id: '1',
        name: 'John Doe',
        email: 'john@doe',
        isAdmin: true
      }

      // mock getToken from next-auth/jwt
      jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

      // call the /api/dates/[id] endpoint
      await dates(req, res)

      // check the status code and data
      expect(res._getStatusCode()).toBe(400)
      expect(res._getData()).toBe('Bad Request')
    })

    it('should return a 400 status code when id is not a string', async () => {
      // create a mock request and response
      const req = createRequest({
        method: 'DELETE',
        url: `/dates/`,
        query: {
          id: 1
        }
      })
      const res = createResponse()

      const mock_token = {
        id: '1',
        name: 'John Doe',
        email: 'john@doe',
        isAdmin: true
      }

      // mock getToken from next-auth/jwt
      jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

      // call the /api/dates/[id] endpoint
      await dates(req, res)

      // check the status code and data
      expect(res._getStatusCode()).toBe(400)
      expect(res._getData()).toBe('Bad Request')
    })

    it('should return a 400 status code when id cannot be parsed to a number', async () => {
      // create a mock request and response
      const req = createRequest({
        method: 'DELETE',
        url: `/dates/`,
        query: {
          id: 'abc'
        }
      })
      const res = createResponse()

      const mock_token = {
        id: '1',
        name: 'John Doe',
        email: 'john@doe',
        isAdmin: true
      }

      // mock getToken from next-auth/jwt
      jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

      // call the /api/dates/[id] endpoint
      await dates(req, res)

      // check the status code and data
      expect(res._getStatusCode()).toBe(400)
      expect(res._getData()).toBe('Bad Request')
    })

    it('should return a 404 status code when id does not exist', async () => {
      const idToDelete = 1

      // create a mock request and response
      const req = createRequest({
        method: 'DELETE',
        url: `/dates/${idToDelete}`,
        query: {
          id: idToDelete.toString()
        }
      })
      const res = createResponse()

      const mock_token = {
        id: '1',
        name: 'John Doe',
        email: 'john@doe',
        isAdmin: true
      }

      // mock getToken from next-auth/jwt
      jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

      prismaMock.entry.delete.mockRejectedValue(new Error('Not Found'))

      // call the /api/dates/[id] endpoint
      await dates(req, res)

      // check the status code and data
      expect(res._getStatusCode()).toBe(404)
      expect(res._getData()).toBe('Not Found')
    })
  })

  it('should return a 405 status code when invalid method', async () => {
    const req = createRequest({
      method: 'PATCH',
      url: '/users'
    })
    const res = createResponse()

    await dates(req, res)

    expect(res._getStatusCode()).toBe(405)
    expect(res._getData()).toBe('Method Not Allowed')
  })
})
