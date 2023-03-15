import * as jwt from 'next-auth/jwt'
import { JWT } from 'next-auth/jwt'

// all fields besides id and isAdmin are optional
export type MockToken = Partial<JWT> & { id: string; isAdmin: boolean }

export const mockToken = ({ id, isAdmin, name = 'John Doe', email = 'john.doe@ad.com' }: MockToken) => {
  // mock getToken from next-auth/jwt
  jest.spyOn(jwt, 'getToken').mockResolvedValue({ id, name, email, isAdmin })
  // return the mock token
  return { id, name, email, isAdmin }
}
