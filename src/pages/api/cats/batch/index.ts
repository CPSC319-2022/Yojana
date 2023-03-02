import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma/prismadb'
import { getToken } from 'next-auth/jwt'

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
          isRepeating: false,
          categoryId: validCategories.find((category) => category.name === categoryToAddTo)?.id
        }
        entriesToAdd.push(entry)
      }
    }
  }
  try {
    const createdEntries = await prisma.entry.createMany({
      data: entriesToAdd.map(
        ({ date, isRepeating = false, categoryId }: { date: Date; isRepeating?: boolean; categoryId?: number }) => ({
          date: date,
          isRepeating: isRepeating,
          categoryId: categoryId
        })
      )
    })
    let response = { entriesAdded: createdEntries.count }
    return res.status(201).json(response)
  } catch (error) {
    return res.status(500).send('Internal Server Error')
  }
}

export default handler
