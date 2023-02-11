import { Prisma } from '@prisma/client'

export type AppData = Prisma.CategoryGetPayload<{
  select: {
    id: true
    name: true
    description: true
    color: true
    isMaster: true
    icon: true
    creator: {
      select: {
        id: true
        email: true
        name: true
        isAdmin: true
      }
    }
    entries: {
      select: {
        id: true
        date: true
      }
    }
  }
}>
