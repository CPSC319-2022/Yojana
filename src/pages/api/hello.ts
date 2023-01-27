import type { NextApiRequest, NextApiResponse } from 'next'

const handler = (req: NextApiRequest, res: NextApiResponse<string>) => {
  res.status(200).json('Hello, World!')
}

export default handler
