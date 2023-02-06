import '@testing-library/jest-dom'
import { prismaMock } from '@/lib/singleton'
import { createRequest, createResponse } from 'node-mocks-http'
import * as jwt from 'next-auth/jwt'
import dates from "@/pages/api/dates";
import { Entry, PrismaPromise } from '@prisma/client'

describe('/api/dates', () => {
  it('GET should return a 200 status code', async () => {
    // create a mock request and response
    const req = createRequest({
      method: 'GET',
      url: '/dates'
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
    let currDate = new Date();
    const mock_dates: Entry[] | PrismaPromise<Entry[]> =
      [{
        categoryId:1,
        date: currDate,
        id:1
    }]

    //mock prisma.user.findMany()
    prismaMock.entry.findMany.mockResolvedValue(mock_dates)

    // call the /api/dates endpoint
    // @ts-ignore
    await dates(req, res)

    // check the status code and data
    expect(res._getStatusCode()).toBe(200)
    expect(res._getData()).toBe(JSON.stringify(mock_dates));




  })


  it('POST should return 200 status', async () => {
    // create a mock request and response
    const req = createRequest({
      method: 'POST',
      url: '/dates',
      body: {
        "categoryId": 1,
        "dates": [Date.now()]
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


    let currDate = new Date();
    const mock_dates: Entry[] | PrismaPromise<Entry[]> =
        [{
          categoryId:1,
          date: currDate,
          id:1
        }]

    //mock prisma.user.findMany()
    prismaMock.entry.findMany.mockResolvedValue(mock_dates)

    // call the /api/users endpoint
    // @ts-ignore
    await dates(req, res)

    // check the status code and data
    expect(res._getStatusCode()).toBe(200)
    expect(res._getData()).toBe(JSON.stringify("Success"));
  })

  it('POST should return a 401 status code when user is not an admin', async () => {
    // create a mock request and response
    const req = createRequest({
      method: 'POST',
      url: '/dates',
      body: {
        "categoryId": 1,
        "dates": [Date.now()]
      }
    })
    const res = createResponse()

    const mock_token = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@ad.com',
      isAdmin: false
    }

    // mock getToken from next-auth/jwt
    jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

    // call the /api/users endpoint
    // @ts-ignore
    await dates(req, res)

    // check the status code and data
    expect(res._getStatusCode()).toBe(401)
    expect(res._getData()).toBe(JSON.stringify('Unauthorized'));
  })

  it('DELETE should return 200 status', async () => {
    // create a mock request and response
    const req = createRequest({
      method: 'DELETE',
      url: '/dates',
      query: {
        id: 1,
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


    let currDate = new Date();
    const mock_dates: Entry[] | PrismaPromise<Entry[]> =
        [{
          categoryId:1,
          date: currDate,
          id:1
        }]

    //mock prisma.user.findMany()
    prismaMock.entry.findUnique.mockResolvedValue(mock_dates[0])

    // call the /api/users endpoint
    // @ts-ignore
    await dates(req, res)

    // check the status code and data
    expect(res._getStatusCode()).toBe(200)
    expect(res._getData()).toBe(JSON.stringify("Success"));
  })

  it('DELETE should return a 401 status code when user is not an admin', async () => {
    // create a mock request and response
    const req = createRequest({
      method: 'DELETE',
      url: '/dates/1',
    })
    const res = createResponse()

    const mock_token = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@ad.com',
      isAdmin: false
    }

    // mock getToken from next-auth/jwt
    jest.spyOn(jwt, 'getToken').mockResolvedValue(mock_token)

    // call the /api/users endpoint
    // @ts-ignore
    await dates(req, res)

    // check the status code and data
    expect(res._getStatusCode()).toBe(401)
    expect(res._getData()).toBe(JSON.stringify('Unauthorized'));
  })

  it('DELETE should return a 404 status code when date does not exist', async () => {
    // create a mock request and response
    const req = createRequest({
      method: 'DELETE',
      url: '/dates',
      query: {
        id: 5
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

    const mock_dates: Entry[] | PrismaPromise<Entry[]> =
        []

    //mock prisma.user.findMany()
    prismaMock.entry.findMany.mockResolvedValue(mock_dates)

    // call the /api/users endpoint
    // @ts-ignore
      await dates(req, res)

    // check the status code and data
    expect(res._getStatusCode()).toBe(404)
    expect(res._getData()).toBe(JSON.stringify('NOT FOUND'));
  })

  it('DELETE should return a 500 status code when id is undefined', async () => {
    // create a mock request and response
    const req = createRequest({
      method: 'DELETE',
      url: '/dates'
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

    const mock_dates: Entry[] | PrismaPromise<Entry[]> =
        []

    //mock prisma.user.findMany()
    prismaMock.entry.findMany.mockResolvedValue(mock_dates)

    // call the /api/users endpoint
    // @ts-ignore
    await dates(req, res)

    // check the status code and data
    expect(res._getStatusCode()).toBe(500)
    expect(res._getData()).toBe(JSON.stringify('UNDEFINED ID'));
  })

})
