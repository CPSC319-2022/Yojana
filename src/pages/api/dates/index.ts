import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prismadb'
import {getToken} from "next-auth/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === 'GET') {
    const dates = await prisma.entry.findMany({
        select: {
            id: true,
            date: true,
            categoryId: true
        }
    });
    res.status(200).json(dates);
  } else if (req.method === 'POST') {
      const token = await getToken({req});
      const categoryId = req.body.categoryId;
      const dates = req.body.dates;
      console.log(req.body.dates);
      if (!token?.isAdmin) {
          res.status(401);
          res.json("Unauthorized");
          return;
      }

      if (categoryId !== undefined) {
          try{
              for (let i = 0; i < dates.length; i++) {
                  await prisma.entry.create({
                      data: {
                          date: dates[i],
                          categoryId: parseInt(categoryId.toString()),
                      }
                  })
              }
              res.status(200);
              res.json("Success");
          } catch(e) {
              res.status(500);
              res.json(e);
          }
          }
      } else if (req.method === 'DELETE') {
      const token = await getToken({req});
      if (!token?.isAdmin) {
          res.status(401);
          res.json("Unauthorized");
          return;
      }

      const id = req.query.id;
      if (id !== undefined) {
           const row =  await prisma.entry.findUnique({
                where: {
                    id: parseInt(id.toString()),
                },
            });
           if (row === undefined) {
               res.status(404);
               res.json("NOT FOUND");
               return;
           }
            res.status(200);
           res.json("Success");
      } else {
          res.status(500);
          res.json("UNDEFINED ID");
      }
  }
  else {
    res.status(405);
  }
}

export default handler;
