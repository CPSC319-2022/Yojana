import * as jwt from 'next-auth/jwt'
import { JWT } from 'next-auth/jwt'
import { createRequest } from 'node-mocks-http'

// all fields besides id and isAdmin are optional
type MockToken = Partial<JWT> & { id: string; isAdmin: boolean }

export const mockToken = ({ id, isAdmin, name = 'John Doe', email = 'john.doe@yojana.com' }: MockToken) => {
  // mock getToken from next-auth/jwt
  jest.spyOn(jwt, 'getToken').mockResolvedValue({ id, name, email, isAdmin })
  // return the mock token
  return { id, name, email, isAdmin }
}

describe('mockToken', () => {
  it('should create a valid mock token', async () => {
    const token = mockToken({ id: '1', isAdmin: true })
    expect(token).toEqual({ id: '1', name: 'John Doe', email: 'john.doe@yojana.com', isAdmin: true })

    // create a mock request
    const req = createRequest()

    // call getToken
    const returnedToken = await jwt.getToken({ req })

    // check that getToken was called
    expect(jwt.getToken).toHaveBeenCalled()

    // check that the returned token is the same as the mock token
    expect(returnedToken).toEqual(token)
  })
})
