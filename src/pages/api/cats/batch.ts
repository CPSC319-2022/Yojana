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
  // TODO: Report all missing/unauthorized category names, fail if any are missing
  const { uneditableCategories, editableCategories } = await getUneditableAndEditableCategoryNames(
    userID!,
    token?.isAdmin || false,
    Object.keys(categories)
  )

  if (uneditableCategories.length > 0) {
    console.log('sending error')
    const response: BatchResponse = {
      success: {
        entries: [],
        appData: []
      },
      error: {
        uneditableCategories: uneditableCategories,
        message: `There are some categories that either do not exist, or you do not have permission to edit`
      }
    }
    return res.status(401).json(response)
  }

  // TODO: Add logic to keep track of duplicate entries i.e adding an entry to a date when there is already one there,
  //  report to frontend if any are found
  let entriesToAdd = []
  const categoryNames = Object.keys(categories)
  for (const categoryToAddTo of categoryNames) {
    for (const newDate of categories[categoryToAddTo]) {
      if (editableCategories.some((category) => category.name === categoryToAddTo)) {
        const entry = {
          date: newDate,
          isRecurring: false,
          categoryId: editableCategories.find((category) => category.name === categoryToAddTo)?.id
        }
        entriesToAdd.push(entry)
      }
    }
  }
  console.log(entriesToAdd)
  try {
    await prisma.entry.createMany({
      data: entriesToAdd.map(({ date, isRecurring, categoryId }) => ({
        date: date,
        isRecurring: isRecurring,
        categoryId: categoryId!
      }))
    })
    const entriesToFind = entriesToAdd.map((entry) => {
      return { date: entry.date, categoryId: entry.categoryId }
    })
    // get entries from database that were just created using date and categoryId
    const addedEntries = await prisma.entry.findMany({
      where: {
        OR: entriesToFind.map((entry) => ({
          date: entry.date,
          categoryId: entry.categoryId
        }))
      }
    })
    // TODO: Add logic to fail if no entries were added. Could be blue alert on frontend
    let appData = await getCategories()
    const response = {
      success: {
        entries: addedEntries,
        appData: appData
      },
      error: undefined
    }
    return res.status(201).json(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send('Internal Server Error')
  }
}

const getUneditableAndEditableCategoryNames = async (userId: string, isAdmin: boolean, categories: string[]) => {
  const editableCategories = await getOwnedCategories(userId, isAdmin)
  const editableCategoryNames = editableCategories.map((category) => category.name)
  const uneditableCategories = categories.filter((category) => !editableCategoryNames.includes(category))
  console.log('uneditableCategories', uneditableCategories)
  return { uneditableCategories, editableCategories }
}

export default handler
