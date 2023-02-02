import type { NextApiRequest, NextApiResponse } from 'next'

const handler = (req: NextApiRequest, res: NextApiResponse<string>) => {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed')
  } else {
    res.status(200).send('Hello, World!')
  }
}

export default handler
