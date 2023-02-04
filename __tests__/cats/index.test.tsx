import { prismaMock } from '@/lib/singleton'
import cats from '@/pages/api/cats'
import '@testing-library/jest-dom'
import { createRequest, createResponse } from 'node-mocks-http'

describe('/api/cats', () => {

    it('should return a 200 status code for GET', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/cats'
        })
        const res = createResponse()

        const mock_cats = [
            {
                id: 0,
                name: "cat1",
                description: "abc",
                color: "",
                isMaster: false,
                creatorId: "1"
            },
            {
                id: 1,
                name: "cat2",
                description: "def",
                color: "",
                isMaster: false,
                creatorId: "1"
            }
        ]
        prismaMock.category.findMany.mockResolvedValue(mock_cats)

        await cats(req, res)

        expect(res._getStatusCode()).toBe(200)
        expect(res._getData()).toBe(JSON.stringify(mock_cats))
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

    it('should return a 201 status code for valid POST', async () => {
        const mock_body = {
            id: 0,
            name: "def",
            description: "abc",
            color: "",
            isMaster: false,
            creatorId: "f0b54ab0-366f-45b1-b750-1d5b79f3603c"
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

    it('should return a 409 status code for non-unique POST', async () => {
        const mock_body = {
            id: 1,
            name: 'test',
            description: 'test category',
            color: 'red',
            isMaster: false,
            creatorId: 'abc123',
            dates: [],
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

    it('should return a 200 status code for valid PUT', async () => {
        const mock_body = {
            id: 0,
            name: 'new name',
            description: 'new desc',
            color: 'blue',
            isMaster: false,
            creatorId: 'cba123',
            dates: [],
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

    it('should return a 404 status code for invalid PUT', async () => {
        const mock_body = {
            id: 999999,
            name: 'not_existing',
            description: 'abc',
            color: '',
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
        expect(res._getData()).toBe("category does not exist")
    })

    it('should return a 409 status code for non-unique PUT', async () => {
        const mock_body = {
            id: 1,
            name: 'dupe',
            description: 'something',
            color: 'red',
            isMaster: false,
            creatorId: 'abc123',
            dates: [],
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