import '@testing-library/jest-dom'
import users from '@/pages/api/users'
import { prismaMock } from '@/lib/singleton'
import { createRequest, createResponse } from 'node-mocks-http'
import * as jwt from 'next-auth/jwt'

describe('/api/users', () => {
  it('should return a 200 status code', async () => {
    // create a mock request and response
    const req = createRequest({
      method: 'GET',
      url: '/users'
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

    const mock_users = [
      { id: '1', name: 'John Doe', email: 'john.doe@ad.com', isAdmin: true },
      { id: '2', name: 'Jane Doe', email: 'jane.doe@ad.com', isAdmin: false }
    ]
    //mock prisma.user.findMany()
    prismaMock.user.findMany.mockResolvedValue(mock_users)

    // call the /api/users endpoint
    await users(req, res)

    // check the status code and data
    expect(res._getStatusCode()).toBe(200)
    expect(res._getData()).toBe(JSON.stringify(mock_users))
  })

  it('should return a 405 status code when method is not GET', async () => {
    // create a mock request and response
    const req = createRequest({
      method: 'POST',
      url: '/users'
    })
    const res = createResponse()

    // call the /api/users endpoint
    await users(req, res)

    // check the status code and data
    expect(res._getStatusCode()).toBe(405)
    expect(res._getData()).toBe('Method Not Allowed')
  })

  it('should return a 401 status code when user is not authenticated', async () => {
    // create a mock request and response
    const req = createRequest({
      method: 'GET',
      url: '/users'
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
})
