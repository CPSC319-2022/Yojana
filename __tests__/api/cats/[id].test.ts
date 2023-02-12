import '@testing-library/jest-dom'
import { createRequest, createResponse } from 'node-mocks-http'
import cats from '@/pages/api/cats/[id]'
import { prismaMock } from '@/prisma/singleton'
import * as jwt from 'next-auth/jwt'
import { generateISODates } from '@/utils/backend/generateISODates'

const mockAdmin = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@ad.com',
  isAdmin: true
}

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@ad.com',
  isAdmin: false
}

const mock_body = {
  id: 1,
  name: 'def',
  description: 'abc',
  color: '#000000',
  isMaster: false,
  creatorId: 'id0',
  dates: generateISODates()
}
describe('/api/cats/[id]', () => {
  describe('DELETE', () => {
    it('should return a 200 status code when category is deleted', async () => {
      const req = createRequest({
        method: 'DELETE',
        url: '/cats/1'
      })
      const res = createResponse()

      jest.spyOn(jwt, 'getToken').mockResolvedValue(mockAdmin)

      prismaMock.category.findFirst.mockResolvedValue(mock_body)

      prismaMock.category.delete.mockResolvedValue(mock_body)

      await cats(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(res._getData()).toBe(JSON.stringify(mock_body))
    })

    it('should return a 401 status code when not Authorized to delete', async () => {
      const req = createRequest({
        method: 'DELETE',
        url: '/cats/1'
      })
      const res = createResponse()

      jest.spyOn(jwt, 'getToken').mockResolvedValue(mockUser)

      await cats(req, res)

      expect(res._getStatusCode()).toBe(401)
      expect(res._getData()).toBe('Unauthorized')
    })

    it('should return a 404 status code when category does not exist', async () => {
      const req = createRequest({
        method: 'DELETE',
        url: '/cats/500'
      })
      const res = createResponse()

      jest.spyOn(jwt, 'getToken').mockResolvedValue(mockAdmin)

      prismaMock.category.findFirst.mockResolvedValue(null)

      await cats(req, res)

      expect(res._getStatusCode()).toBe(404)
      expect(res._getData()).toBe('category does not exist')
    })

    it('should return a 409 when there is an error processing request', async () => {
      const req = createRequest({
        method: 'DELETE',
        url: '/cats',
        body: mock_body
      })
      const res = createResponse()

      jest.spyOn(jwt, 'getToken').mockResolvedValue(mockAdmin)

      prismaMock.category.findFirst.mockResolvedValue(mock_body)

      prismaMock.category.delete.mockRejectedValue(new Error('processing error'))

      await cats(req, res)

      expect(res._getStatusCode()).toBe(409)
      expect(res._getData()).toBe('There was an error deleting the category')
    })
  })
})
