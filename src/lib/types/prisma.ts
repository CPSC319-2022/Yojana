import { Category, Entry, Prisma } from '@prisma/client'

// This is the same as Category, but with the show property
export interface CategoryState extends Category {
  show: boolean
}

// This is the type that is returned from the Prisma client
export type CategoryFull = Prisma.CategoryGetPayload<{
  select: {
    id: true
    name: true
    description: true
    color: true
    isMaster: true
    icon: true
    cron: true
    startDate: true
    endDate: true
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
        isRecurring: true
      }
    }
  }
}>

// This is the same as CategoryFull, but with the show property for the Category
export interface CategoryFullState extends CategoryFull {
  show: boolean
}

// This is the type that is used in the Redux store in the AppDataReducer
export type AppData = CategoryFullState[]

// This is the same as Entry, but without the categoryId property
export interface EntryWithoutCategoryId extends Omit<Entry, 'categoryId'> {}

export interface BatchResponse {
  success: {
    entries: Entry[]
    appData: CategoryFull[]
  }
  error: {
    message: string
    uneditableCategories: string[]
  }
}
