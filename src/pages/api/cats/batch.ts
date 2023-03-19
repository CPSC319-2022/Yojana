import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma/prismadb'
import { getToken } from 'next-auth/jwt'
import { getCategories, getOwnedCategories } from '@/prisma/queries'
import z from 'zod'
import { BatchResponse } from '@/types/prisma'

const schema = z.object({
  userID: z.string().optional()
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }
  const token = await getToken({ req })
  const { userID } = schema.parse(req.query)
  const categories = req.body
  const categoryIDs = Object.keys(categories).map(Number)
  const { uneditableCategories, editableCategories } = await getUneditableAndEditableCategoryIDs(
    userID!,
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
    let appData = await getCategories(userID)
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
      const entry = {
        date: newDate,
        isRecurring: false,
        categoryId: categoryToAddTo
      }
      entriesToAdd.push(entry)
    }
  }
  return entriesToAdd
}

export default handler
