import '@testing-library/jest-dom'
import hello from '@/pages/api/hello'
import { createRequest, createResponse } from 'node-mocks-http'

describe('/api/hello', () => {
  it('should return a 200 status code', async () => {
    // create a mock request and response
    const req = createRequest({
      method: 'GET',
      url: '/hello'
    })
    const res = createResponse()

    // call the /api/hello endpoint
    await hello(req, res)

    // check the status code and data
    expect(res._getStatusCode()).toBe(200)
    expect(res._getData()).toBe('"Hello, World!"')
  })

  it('should return a 405 status code when method is not GET', async () => {
    // create a mock request and response
    const req = createRequest({
      method: 'POST',
      url: '/hello'
    })
    const res = createResponse()

    // call the /api/hello endpoint
    await hello(req, res)

    // check the status code and data
    expect(res._getStatusCode()).toBe(405)
    expect(res._getData()).toBe('Method Not Allowed')
  })
})
