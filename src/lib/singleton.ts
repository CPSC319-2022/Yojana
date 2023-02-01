// This file is used to mock the prisma prismadb in tests
// https://www.prisma.io/docs/guides/testing/unit-testing#singleton
import { PrismaClient } from '@prisma/client'
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'

import prisma from './prismadb'

jest.mock('./prismadb', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>()
}))

beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
