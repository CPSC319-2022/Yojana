import type { NextApiRequest, NextApiResponse } from 'next'

const handler = (req: NextApiRequest, res: NextApiResponse<string>) => {
  switch (req.method) {
    case 'GET':
      return res.status(200).send('Hello, World!')
    default:
      return res.status(405).send('Method Not Allowed')
  }
}

export default handler
