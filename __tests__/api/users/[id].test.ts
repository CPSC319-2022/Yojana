import '@testing-library/jest-dom'
import { createRequest, createResponse } from 'node-mocks-http'
import users from '@/pages/api/users/[id]'
import { prismaMock } from '@/prisma/singleton'
import * as jwt from 'next-auth/jwt'

// unit tests for the /api/users/:id endpoint
describe('/api/users/[id]', () => {
  describe('GET', () => {
    it('should return a 200 status code and the user data for a valid user id', async () => {
      const mock_token = { id: '1', email: 'john.doe@ad.com', name: 'John Doe', isAdmin: true }

      // create a mock request and response with a valid user id
      const req = createRequest({
        method: 'GET',
        url: `/users/${mock_token.id}`,
        query: {
          id: mock_token.id.toString()
        }
      })

      const res = createResponse()

      // mock getToken from next-auth/jwt
      jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

      const mock_user = {
        id: '1',
        email: 'john.doe@ad.com',
        name: 'John Doe',
        isAdmin: true
      }

      // mock prisma.user.findUnique() to return the expected user data
      prismaMock.user.findUniqueOrThrow.mockResolvedValue(mock_user)

      // call the /api/users/:id endpoint
      await users(req, res)

      // check the status code and data
      expect(res._getStatusCode()).toBe(200)
      expect(res._getData()).toBe(JSON.stringify(mock_user))
    })
    it('should return a 400 status code when there is no id', async () => {
      const mock_token = { id: '1', email: 'john.doe@ad.com', name: 'John Doe', isAdmin: true }

      // create a mock request and response with no id parameter
      const req = createRequest({
        method: 'GET',
        url: '/users'
      })

      const res = createResponse()

      // mock getToken from next-auth/jwt
      jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

      // call the /api/users/:id endpoint
      await users(req, res)

      // check the status code and data
      expect(res._getStatusCode()).toBe(400)
      expect(res._getData()).toBe('Bad Request')
    })
    it('should return a 400 status code if id is not a string', async () => {
      const mock_token = { id: '1', email: 'john.doe@ad.com', name: 'John Doe', isAdmin: true }

      // create a mock request and response with an invalid user id (not a string)
      const req = createRequest({
        method: 'GET',
        url: `/users/123`,
        query: {
          id: 123
        }
      })
      const res = createResponse()

      // mock getToken from next-auth/jwt
      jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

      // call the /api/users/:id endpoint
      await users(req, res)

      // check the status code and error message
      expect(res._getStatusCode()).toBe(400)
      expect(res._getData()).toBe('Bad Request')
    })
    it('should return a 401 status code when user is not an admin', async () => {
      const mock_token = { id: '1', email: 'john.doe@ad.com', name: 'John Doe', isAdmin: true }

      // create a mock request and response
      const req = createRequest({
        method: 'GET',
        url: `/users/${mock_token.id}`,
        query: {
          id: mock_token.id.toString()
        }
      })
      const res = createResponse()

      // mock getToken from next-auth/jwt
      jest.spyOn(jwt, 'getToken').mockResolvedValue(null)

      // call the /api/users endpoint
      await users(req, res)

      // check the status code and data
      expect(res._getStatusCode()).toBe(401)
      expect(res._getData()).toBe('Unauthorized')
    })
    it('should return a 404 status code when user is not found', async () => {
      const userId = '999'

      // create a mock request and response
      const req = createRequest({
        method: 'GET',
        url: `/users/${userId}`,
        query: {
          id: userId.toString()
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

      // mock prisma.user.findUnique() to return null for a user not found error
      prismaMock.user.findUniqueOrThrow.mockRejectedValue(new Error('Not Found'))

      // call the /api/users/:id endpoint
      await users(req, res)

      // check the status code and data
      expect(res._getStatusCode()).toBe(404)
      expect(res._getData()).toBe('Not Found')
    })
  })

  it('should return a 405 status code for an invalid HTTP method', async () => {
    const req = createRequest({
      method: 'POST',
      url: '/users/1'
    })
    const res = createResponse()

    // mock getToken from next-auth/jwt
    jest
      .spyOn(jwt, 'getToken')
      .mockResolvedValue({ id: '1', email: 'john.doe@ad.com', name: 'John Doe', isAdmin: true })

    // call the /api/users/:id endpoint with an invalid method
    await users(req, res)

    // check the status code
    expect(res._getStatusCode()).toBe(405)
    expect(res._getData()).toBe('Method Not Allowed')
  })
})
