// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { ErrorResponse, GetDailyWinsResponse } from "@/lib/constants/responses";
import { getUserFromAuthHeader } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetDailyWinsResponse | ErrorResponse>
) {
  if (req.method === "GET") {
    try {
      if (!req.headers.authorization) {
        return res.status(401).end();
      }

      const user = await getUserFromAuthHeader(req.headers.authorization);

      if (!user.email) {
        return res.status(401).end();
      }

      const prisma = new PrismaClient();

      const dailyWins = await prisma.dailyWins.findMany({
        where: {
          userId: user.id,
        },
      });

      res.status(400).send({
        data: dailyWins,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  } else {
    return res.status(405).end();
  }
}
