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

    // call the hello API route
    await hello(req, res)

    // check the status code and data
    expect(res._getStatusCode()).toBe(200)
    expect(res._getData()).toBe('"Hello, World!"')
  })
})
