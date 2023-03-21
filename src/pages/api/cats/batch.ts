import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma/prismadb'
import { getToken } from 'next-auth/jwt'
import { getCategories } from '@/prisma/queries'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }
  const token = await getToken({ req })
  if (!token?.isAdmin) {
    return res.status(401).send('Unauthorized')
  }
  const categories = req.body
  const validCategories = await prisma.category.findMany({
    where: {
      name: {
        in: Object.keys(categories)
      }
    }
  })
  let entriesToAdd = []
  for (const categoryToAddTo of Object.keys(categories)) {
    for (const newDate of categories[categoryToAddTo]) {
      if (validCategories.some((category) => category.name === categoryToAddTo)) {
        const entry = {
          date: newDate,
          isRecurring: false,
          categoryId: validCategories.find((category) => category.name === categoryToAddTo)?.id
        }
        entriesToAdd.push(entry)
      }
    }
  }
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
    let appData = await getCategories(token.id)
    const response = {
      appData: appData,
      createdEntries: addedEntries
    }
    return res.status(201).json(response)
  } catch (error) {
    return res.status(500).send('Internal Server Error')
  }
}

export default handler
