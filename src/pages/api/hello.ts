import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * route: /api/hello
 *
 * sanity check to make sure the api is working
 *
 * GET: Hello, World!
 * @param req
 * @param res
 */
const handler = (req: NextApiRequest, res: NextApiResponse<string>) => {
  switch (req.method) {
    case 'GET':
      return res.status(200).send('Hello, World!')
    default:
      return res.status(405).send('Method Not Allowed')
  }
}

export default handler
