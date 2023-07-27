// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import {
  ErrorResponse,
  GetDailyWinsResponse,
  CreateDailyWinResponse,
  UpdateDailyWinResponse,
} from "@/lib/constants/responses";
import {
  CreateDailyWinRequest,
  CreateDailyWinSchema,
  UpdateDailyWinRequest,
  UpdateDailyWinSchema,
} from "@/lib/constants/requests";
import { getUserFromAuthHeader } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | GetDailyWinsResponse
    | CreateDailyWinResponse
    | UpdateDailyWinResponse
    | ErrorResponse
  >
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

      res.status(200).send({
        data: dailyWins,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  } else if (req.method === "POST") {
    if (!req.headers.authorization) {
      return res.status(401).end();
    }

    const user = await getUserFromAuthHeader(req.headers.authorization);

    if (!user.email) {
      return res.status(401).end();
    }

    let createDailyWinRequest: CreateDailyWinRequest = req.body;
    try {
      CreateDailyWinSchema.parse(createDailyWinRequest);
    } catch (err) {
      console.dir(err);
      return res.status(400).json({ message: "Incomplete or invalid fields." });
    }

    const prisma = new PrismaClient();

    const dailyWin = await prisma.dailyWins.create({
      data: {
        userId: user.id,
        content: createDailyWinRequest.content,
        date: createDailyWinRequest.date,
      },
    });

    res.status(200).json({ data: dailyWin });
    try {
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  } else if (req.method === "PUT") {
    try {
      if (!req.headers.authorization) {
        return res.status(401).end();
      }

      const user = await getUserFromAuthHeader(req.headers.authorization);

      if (!user.email) {
        return res.status(401).end();
      }

      let updateRequest: UpdateDailyWinRequest = req.body;
      try {
        UpdateDailyWinSchema.parse(updateRequest);
      } catch (err) {
        return res
          .status(400)
          .json({ message: "Incomplete or invalid fields." });
      }

      const prisma = new PrismaClient();

      try {
        const dailyWin = await prisma.dailyWins.findUnique({
          where: {
            id: updateRequest.id,
          },
        });

        if (!dailyWin) {
          throw new Error();
        }

        if (dailyWin.userId !== user.id) {
          return res.status(403).end();
        }
      } catch (err) {
        return res.status(404).json({ message: "ID not found" });
      }

      if (!updateRequest.delete) {
        const dailyWin = await prisma.dailyWins.update({
          where: {
            id: updateRequest.id,
          },
          data: {
            content: updateRequest.content,
          },
        });

        return res.status(200).json({ data: dailyWin });
      } else {
        const dailyWin = await prisma.dailyWins.delete({
          where: {
            id: updateRequest.id,
          },
        });

        return res.status(200).json({ data: dailyWin });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).end();
  }
}
