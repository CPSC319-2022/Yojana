import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma/prismadb'
import * as util from 'util'
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
  console.log(util.inspect(categories, { showHidden: false, depth: null, colors: true }))

  console.log(Object.keys(categories))
  const validCategories = await prisma.category.findMany({
    where: {
      name: {
        in: Object.keys(categories)
      }
    }
  })
  console.log('printing valid categories')
  console.log(validCategories)
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
  console.log(entriesToAdd)
  try {
    await prisma.entry.createMany({
      data: entriesToAdd.map(
        ({ date, isRepeating = false, categoryId }: { date: Date; isRepeating?: boolean; categoryId?: number }) => ({
          date: date,
          isRepeating: isRepeating,
          categoryId: categoryId
        })
      )
    })
    return res.status(200).send(`${entriesToAdd.length} entries added`)
  } catch (error) {
    console.log(error)
    return res.status(500).send('Internal Server Error')
  }
}

export default handler
