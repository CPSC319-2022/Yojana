import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma/prismadb'
import { getToken } from 'next-auth/jwt'
import { getCategories, getOwnedCategories } from '@/prisma/queries'
import z from 'zod'
import { BatchResponse } from '@/types/prisma'

export const bodySchema = z
  .record(
    z.array(
      z.string().refine(
        (val) => {
          const regex = /^\d{4}-\d{2}-\d{2}$/
          return regex.test(val)
        },
        { message: 'Date column should contain only dates in the format YYYY-MM-DD' }
      )
    )
  )
  .refine(
    (key) => {
      const keys = Object.keys(key)
      return keys.every((key) => parseInt(key) === parseFloat(key) && Number.isInteger(parseFloat(key)))
    },
    { message: 'CategoryID column should only contain integer CategoryIDs' }
  )
  .refine((value) => value !== undefined, {
    message: 'Input object should not be undefined'
  })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }
  // Validate schema and setup Constants
  try {
    bodySchema.parse(req.body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response: BatchResponse = {
        success: undefined,
        error: {
          code: 400,
          message: error.errors[0].message,
          uneditableCategories: []
        }
      }
      return res.status(400).json(response)
    }
  }
  const token = await getToken({ req })
  const userID = token?.id || ''
  const categories = req.body
  const categoryIDs = Object.keys(categories).map(Number)

  // Check if user has permission to edit all categories in request
  const { uneditableCategories, editableCategories } = await getUneditableAndEditableCategoryIDs(
    userID! as string,
    token?.isAdmin || false,
    categoryIDs
  )
  if (uneditableCategories.length > 0) {
    const response: BatchResponse = {
      success: undefined,
      error: {
        code: 401,
        uneditableCategories: uneditableCategories,
        message: `There are some categories that either do not exist, or you do not have permission to edit`
      }
    }
    return res.status(401).json(response)
  }
  let entriesToAdd = getEntriesFromCategoryIDMappings(categoryIDs, categories)
  try {
    const addedEntries = await prisma.entry.createMany({
      data: entriesToAdd.map(({ date, isRecurring, categoryId }) => ({
        date: date,
        isRecurring: isRecurring,
        categoryId: categoryId!
      })),
      skipDuplicates: true
    })
    if (addedEntries.count === 0) {
      const response: BatchResponse = {
        success: undefined,
        error: {
          code: 422,
          message: 'No Changes Made, make sure you are not adding duplicate entries',
          uneditableCategories: []
        }
      }
      return res.status(422).json(response)
    }
    // If entries were added, send success code and updated appData
    let appData = await getCategories(userID as string)
    const response: BatchResponse = {
      success: {
        entriesAdded: addedEntries.count,
        appData: appData
      },
      error: undefined
    }
    return res.status(201).json(response)
  } catch (error) {
    return res.status(500).send('Internal Server Error')
  }
}

const getUneditableAndEditableCategoryIDs = async (userId: string, isAdmin: boolean, categories: number[]) => {
  const editableCategories = await getOwnedCategories(userId, isAdmin)
  const editableCategoryIDs = editableCategories.map((category) => {
    return category.id
  })
  const uneditableCategories = categories.filter((category) => !editableCategoryIDs.includes(category))
  return { uneditableCategories, editableCategories }
}

function getEntriesFromCategoryIDMappings(categoryIDs: number[], categories: any) {
  let entriesToAdd = []
  for (const categoryToAddTo of categoryIDs) {
    for (const newDate of categories[categoryToAddTo]) {
      const dateParts = newDate.split('-')
      const entry = {
        date: new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2])).toISOString(),
        isRecurring: false,
        categoryId: categoryToAddTo
      }
      entriesToAdd.push(entry)
    }
  }
  return entriesToAdd
}

export default handler
