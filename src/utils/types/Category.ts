import { Prisma } from '@prisma/client'

const entry = Prisma.validator<Prisma.EntryArgs>()({
  select: { id: true, date: true }
})

const entryWithCatId = Prisma.validator<Prisma.EntryArgs>()({
  select: { id: true, date: true, categoryId: true }
})

export type Category = Prisma.CategoryGetPayload<{
  select: {
    id: true
    name: true
    description: true
    color: true
    isMaster: true
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

export type Entry = Prisma.EntryGetPayload<typeof entry>
export type EntryWithCatId = Prisma.EntryGetPayload<typeof entryWithCatId>
