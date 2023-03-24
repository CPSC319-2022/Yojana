import { prismaMock } from '@/prisma/singleton'
import batch from '@/pages/api/cats/batch'
import '@testing-library/jest-dom'
import { createRequest, createResponse } from 'node-mocks-http'
import * as jwt from 'next-auth/jwt'
import { Category, Entry } from '@prisma/client'
import { BatchResponse } from '@/types/prisma'

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

const mockBody = {
  1: ['2025-03-10', '2025-03-04'],
  2: ['2025-03-22']
}

const expectedResponse: Entry[] = [
  {
    id: 1,
    date: new Date('2025-03-10T00:00:00.000Z'),
    isRecurring: false,
    categoryId: 21
  },
  {
    id: 2,
    date: new Date('2025-03-04T00:00:00.000Z'),
    isRecurring: false,
    categoryId: 21
  },
  {
    id: 3,
    date: new Date('2025-03-22T00:00:00.000Z'),
    isRecurring: false,
    categoryId: 22
  }
]

const mockValidCats = [
  {
    id: 1,
    name: 'Testing1',
    description: '',
    color: '#7f19b0',
    isMaster: false,
    icon: 'CurrencyDollar',
    cron: '',
    startDate: null,
    endDate: null,
    creatorId: 'f0b54ab0-366f-45b1-b750-1d5b79f3603c'
  },
  {
    id: 2,
    name: 'Testing2',
    description: '',
    color: '#34cf29',
    isMaster: false,
    icon: 'CurrencyDollar',
    cron: '',
    startDate: null,
    endDate: null,
    creatorId: 'f0b54ab0-366f-45b1-b750-1d5b79f3603c'
  }
]

const mockNoCats: Category[] = []

describe('/api/cats/batch', () => {
  describe('POST', () => {
    it('should return a 201 status code when all entries are added', async () => {
      const req = createRequest({
        method: 'POST',
        url: '/cats/batch',
        body: mockBody
      })
      const res = createResponse()

      jest.spyOn(jwt, 'getToken').mockResolvedValue(mockAdmin)

      prismaMock.category.findMany.mockResolvedValue(mockValidCats)

      prismaMock.entry.createMany.mockResolvedValue({ count: 3 })

      prismaMock.entry.findMany.mockResolvedValue(expectedResponse)

      await batch(req, res)

      expect(res._getStatusCode()).toBe(201)
      const data: BatchResponse = JSON.parse(res._getData())
      expect(data.error).toBe(undefined)
      expect(data.success?.entriesAdded).toEqual(3)
    })

    it('should return a 500 status code when batch add fails', async () => {
      const req = createRequest({
        method: 'POST',
        url: '/cats/batch',
        body: mockBody
      })
      const res = createResponse()

      jest.spyOn(jwt, 'getToken').mockResolvedValue(mockAdmin)

      prismaMock.category.findMany.mockResolvedValue(mockValidCats)

      prismaMock.entry.createMany.mockRejectedValue(new Error('Error'))

      await batch(req, res)

      expect(res._getStatusCode()).toBe(500)
      expect(res._getData()).toBe('Internal Server Error')
    })

    it('should return a 401 status code when user attempts to edit an unauthorized category', async () => {
      const req = createRequest({
        method: 'POST',
        url: '/cats/batch',
        body: mockBody
      })
      const res = createResponse()

      jest.spyOn(jwt, 'getToken').mockResolvedValue(mockUser)

      prismaMock.category.findMany.mockResolvedValue(mockNoCats)

      await batch(req, res)

      expect(res._getStatusCode()).toBe(401)
      const data: BatchResponse = JSON.parse(res._getData())
      expect(data.error).toBeDefined()
      expect(data.success).toBeUndefined()
      expect(data.error?.uneditableCategories).toEqual([1, 2])
      expect(data.error?.code).toEqual(401)
    })

    it('should return a 401 status code when user not logged in', async () => {
      const req = createRequest({
        method: 'POST',
        url: '/cats/batch',
        body: mockBody
      })
      const res = createResponse()

      jest.spyOn(jwt, 'getToken').mockResolvedValue(null)

      await batch(req, res)

      expect(res._getStatusCode()).toBe(401)
      const data: BatchResponse = JSON.parse(res._getData())
      expect(data.error).toBeDefined()
      expect(data.success).toBeUndefined()
      expect(data.error?.uneditableCategories).toEqual([])
      expect(data.error?.code).toEqual(401)
    })

    it('should fail if request body has incorrect schema', async () => {
      const req = createRequest({
        method: 'POST',
        url: '/cats/batch',
        body: { incorrect: 'schema' }
      })
      const res = createResponse()

      await batch(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data: BatchResponse = JSON.parse(res._getData())
      expect(data.error).toBeDefined()
      expect(data.success).toBeUndefined()
      expect(data.error?.code).toEqual(400)
    })

    it('should fail if invalid date', async () => {
      const req = createRequest({
        method: 'POST',
        url: '/cats/batch',
        body: { 1: ['invalid'] }
      })
      const res = createResponse()

      await batch(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data: BatchResponse = JSON.parse(res._getData())
      expect(data.error).toBeDefined()
      expect(data.success).toBeUndefined()
      expect(data.error?.code).toEqual(400)
    })

    it('should fail if no entries were added', async () => {
      const req = createRequest({
        method: 'POST',
        url: '/cats/batch',
        body: mockBody
      })
      const res = createResponse()

      jest.spyOn(jwt, 'getToken').mockResolvedValue(mockAdmin)

      prismaMock.category.findMany.mockResolvedValue(mockValidCats)

      prismaMock.entry.createMany.mockResolvedValue({ count: 0 })

      await batch(req, res)

      expect(res._getStatusCode()).toBe(422)
      const data: BatchResponse = JSON.parse(res._getData())
      expect(data.error).toBeDefined()
      expect(data.success).toBeUndefined()
      expect(data.error?.code).toEqual(422)
    })
  })

  it('should return a 405 status code when invalid method', async () => {
    const req = createRequest({
      method: 'PATCH',
      url: '/cats/batch'
    })
    const res = createResponse()

    await batch(req, res)

    expect(res._getStatusCode()).toBe(405)
    expect(res._getData()).toBe('Method Not Allowed')
  })
})
