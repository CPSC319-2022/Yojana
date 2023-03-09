import { prismaMock } from '@/prisma/singleton'
import batch from '@/pages/api/cats/batch'
import '@testing-library/jest-dom'
import { createRequest, createResponse } from 'node-mocks-http'
import * as jwt from 'next-auth/jwt'
import { Entry } from '@prisma/client'

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
  Testing1: ['2025-03-10T00:00:00.000Z', '2025-03-04T00:00:00.000Z'],
  Testing2: ['2025-03-22T00:00:00.000Z'],
  Testing3: ['2025-03-18T00:00:00.000Z']
}

const expectedResponse: Entry[] = [
  {
    id: 1,
    date: new Date('2025-03-10T00:00:00.000Z'),
    isRepeating: false,
    categoryId: 21
  },
  {
    id: 2,
    date: new Date('2025-03-04T00:00:00.000Z'),
    isRepeating: false,
    categoryId: 21
  },
  {
    id: 3,
    date: new Date('2025-03-22T00:00:00.000Z'),
    isRepeating: false,
    categoryId: 22
  }
]

const mockValidCats = [
  {
    id: 21,
    name: 'Testing1',
    description: '',
    color: '#7f19b0',
    isMaster: false,
    icon: '',
    cron: '',
    startDate: null,
    endDate: null,
    creatorId: 'f0b54ab0-366f-45b1-b750-1d5b79f3603c'
  },
  {
    id: 22,
    name: 'Testing2',
    description: '',
    color: '#34cf29',
    isMaster: false,
    icon: '',
    cron: '',
    startDate: null,
    endDate: null,
    creatorId: 'f0b54ab0-366f-45b1-b750-1d5b79f3603c'
  }
]

describe('/api/cats/batch', () => {
  describe('POST', () => {
    it('should return a 201 status code when batch categories are added', async () => {
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
      expect(res._getData()).toBe(JSON.stringify({ appData: mockValidCats, createdEntries: expectedResponse }))
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

    it('should return a 401 status code when user is not an admin', async () => {
      const req = createRequest({
        method: 'POST',
        url: '/cats/batch',
        body: mockBody
      })
      const res = createResponse()

      jest.spyOn(jwt, 'getToken').mockResolvedValue(mockUser)

      await batch(req, res)

      expect(res._getStatusCode()).toBe(401)
      expect(res._getData()).toBe('Unauthorized')
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
