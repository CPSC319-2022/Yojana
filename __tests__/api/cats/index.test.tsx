import { prismaMock } from '@/lib/singleton'
import cats from '@/pages/api/cats'
import '@testing-library/jest-dom'
import { createRequest, createResponse } from 'node-mocks-http'
import * as jwt from "next-auth/jwt";

const generateISODates = () => {
  return Array.from({ length: 5 }, (_, i) => new Date(`2023-01-0${i + 1}`).toISOString())
}

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

describe('/api/cats', () => {
  describe('GET', () => {
    it('should return a 200 status code', async () => {
      const req = createRequest({
        method: 'GET',
        url: '/cats'
      })
      const res = createResponse()

      const mock_cats = [
        {
          id: 0,
          name: 'cat1',
          description: 'abc',
          color: '#000000',
          isMaster: false,
          creator: {
            id: '1',
            name: 'test',
            email: '',
            isAdmin: false
          },
          dates: [
            {
              id: 0,
              date: new Date('2023-01-01').toISOString(),
              categoryId: 0
            }
          ]
        }
      ]
      prismaMock.category.findMany.mockImplementation((): any => {
        return Promise.resolve(mock_cats)
      })

      await cats(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(res._getData()).toBe(JSON.stringify(mock_cats))
    })
  })

  describe('POST', () => {
    it('should return a 201 status code when category is created', async () => {
      const mock_body = {
        id: 0,
        name: 'def',
        description: 'abc',
        color: '#000000',
        isMaster: false,
        creatorId: 'id0',
        dates: generateISODates()
      }
      const req = createRequest({
        method: 'POST',
        url: '/cats',
        body: mock_body
      })
      const res = createResponse()

      prismaMock.category.create.mockResolvedValue(mock_body)

      await cats(req, res)

      expect(res._getStatusCode()).toBe(201)
      expect(res._getData()).toBe(JSON.stringify(mock_body))
    })

    it('should return a 409 status code when category name is not unique', async () => {
      const mock_body = {
        id: 1,
        name: 'test',
        description: 'test category',
        color: '#000000',
        isMaster: false,
        creatorId: 'abc123',
        entries: generateISODates()
      }

      const req = createRequest({
        method: 'POST',
        url: '/cats',
        body: mock_body
      })
      const res = createResponse()

      prismaMock.category.findFirst.mockResolvedValue(mock_body)

      await cats(req, res)

      expect(res._getStatusCode()).toBe(409)
      expect(res._getData()).toBe('category name must be unique')
    })
  })

  describe('DELETE', () => {
    it('should return a 200 status code when category is deleted', async () => {
      const mock_body = {
        id: 0,
        name: 'category to delete',
        description: 'new desc',
        color: '#000000',
        isMaster: false,
        creatorId: 'authorized user'
      }
      const req = createRequest({
        method: 'DELETE',
        url: '/cats',
        body: mock_body
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
      const mock_body = {
        id: 0,
        name: 'category to delete',
        description: 'new desc',
        color: '#000000',
        isMaster: false,
        creatorId: 'unauthorized user'
      }
      const req = createRequest({
        method: 'DELETE',
        url: '/cats',
        body: mock_body
      })
      const res = createResponse()

      jest.spyOn(jwt, 'getToken').mockResolvedValue(mockUser)

      await cats(req, res)

      expect(res._getStatusCode()).toBe(401)
      expect(res._getData()).toBe("Unauthorized")
    })

    it('should return a 404 status code when category does not exist', async () => {
      const mock_body = {
        id: 999999,
        name: 'not_existing',
        description: 'abc',
        color: '#000000',
        isMaster: false,
        creatorId: '1'
      }
      const req = createRequest({
        method: 'DELETE',
        url: '/cats',
        body: mock_body
      })
      const res = createResponse()

      jest.spyOn(jwt, 'getToken').mockResolvedValue(mockAdmin)

      prismaMock.category.update.mockRejectedValue(new Error('category does not exist'))

      await cats(req, res)

      expect(res._getStatusCode()).toBe(404)
      expect(res._getData()).toBe('category does not exist')
    })

    it('should return a 409 when there is an error processing request', async () => {
      const mock_body = {
        id: 999999,
        name: 'not_existing',
        description: 'abc',
        color: '#000000',
        isMaster: false,
        creatorId: '1'
      }
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

  describe('PUT', () => {
    it('should return a 200 status code when category is updated', async () => {
      const mock_body = {
        id: 0,
        name: 'new name',
        description: 'new desc',
        color: '#000000',
        isMaster: false,
        creatorId: 'cba123'
      }
      const req = createRequest({
        method: 'PUT',
        url: '/cats',
        body: mock_body
      })
      const res = createResponse()

      prismaMock.category.update.mockResolvedValue(mock_body)
      await cats(req, res)

      expect(res._getStatusCode()).toBe(200)
      expect(res._getData()).toBe(JSON.stringify(mock_body))
    })

    it('should return a 404 status code when category does not exist', async () => {
      const mock_body = {
        id: 999999,
        name: 'not_existing',
        description: 'abc',
        color: '#000000',
        isMaster: false,
        creatorId: '1'
      }
      const req = createRequest({
        method: 'PUT',
        url: '/cats',
        body: mock_body
      })
      const res = createResponse()

      prismaMock.category.update.mockRejectedValue(new Error('category does not exist'))

      await cats(req, res)

      expect(res._getStatusCode()).toBe(404)
      expect(res._getData()).toBe('category does not exist')
    })

    it('should return a 409 status code when category name is not unique', async () => {
      const mock_body = {
        id: 1,
        name: 'dupe',
        description: 'something',
        color: '#000000',
        isMaster: false,
        creatorId: 'abc123'
      }

      const req = createRequest({
        method: 'PUT',
        url: '/cats',
        body: mock_body
      })
      const res = createResponse()

      prismaMock.category.findFirst.mockResolvedValue(mock_body)

      await cats(req, res)

      expect(res._getStatusCode()).toBe(409)
      expect(res._getData()).toBe('category name conflicting other category')
    })
  })

  it('should return a 405 status code when invalid method', async () => {
    const req = createRequest({
      method: 'PATCH',
      url: '/users'
    })
    const res = createResponse()

    await cats(req, res)

    expect(res._getStatusCode()).toBe(405)
    expect(res._getData()).toBe('Method Not Allowed')
  })
})
