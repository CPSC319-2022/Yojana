import { prismaMock } from '@/lib/singleton'
import cats from '@/pages/api/cats'
import '@testing-library/jest-dom'
import { createRequest, createResponse } from 'node-mocks-http'

describe('/api/cats', () => {
    it('should return a 201 status code for valid POST', async () => {
        // create a mock request and response
        const firstMockId = 7
        const mock_body = {
            id: firstMockId,
            name: "7",
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

        const mock_res = {
            _links: {
                self: {
                    href: "http://localhost:3000/api/cats/" + firstMockId
                }
            },
            id: firstMockId,
            Message: "The category was created successfully"
        }

        prismaMock.category.create.mockResolvedValue(mock_body)

        // call the /api/cats endpoint
        await cats(req, res)

        // check the status code and data
        expect(res._getStatusCode()).toBe(201)
        expect(res._getData()).toBe(JSON.stringify(mock_res))
    })
})
