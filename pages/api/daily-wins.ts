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
import { prisma } from "@/lib/db";
import requestIp from "request-ip";
import { checkRateLimit } from "@/lib/api";

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
      const ip = requestIp.getClientIp(req);
      if (ip && !(await checkRateLimit(ip))) {
        return res
          .status(429)
          .json({ message: "Rate limit exceeded. Try again in 1 minute." });
      }

      if (!req.headers.authorization) {
        return res.status(401).json({ message: "Invalid token." });
      }

      const user = await getUserFromAuthHeader(req.headers.authorization);

      if (!user.email) {
        return res.status(401).json({ message: "Invalid token." });
      }

      const { date } = req.query;

      const dailyWins =
        typeof date !== "string"
          ? await prisma.dailyWins.findMany({
              where: {
                userId: user.id,
              },
            })
          : await prisma.dailyWins.findMany({
              where: {
                date: date,
              },
            });

      res.status(200).send({
        data: dailyWins.map((win) => {
          return {
            ...win,
            date: win.date.toISOString(),
          };
        }),
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  } else if (req.method === "POST") {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Invalid token." });
    }

    const user = await getUserFromAuthHeader(req.headers.authorization);

    if (!user.email) {
      return res.status(401).json({ message: "Invalid token." });
    }

    let createDailyWinRequest: CreateDailyWinRequest = req.body;
    console.log(createDailyWinRequest);

    try {
      CreateDailyWinSchema.parse(createDailyWinRequest);
    } catch (err) {
      console.dir(err);
      return res.status(400).json({ message: "Incomplete or invalid fields." });
    }

    const dailyWin = await prisma.dailyWins.create({
      data: {
        userId: user.id,
        content: createDailyWinRequest.content,
        date: createDailyWinRequest.date,
      },
    });

    res.status(200).json({
      data: {
        ...dailyWin,
        date: dailyWin.date.toISOString(),
      },
    });
    try {
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  } else if (req.method === "PUT") {
    try {
      if (!req.headers.authorization) {
        return res.status(401).json({ message: "Invalid token." });
      }

      const user = await getUserFromAuthHeader(req.headers.authorization);

      if (!user.email) {
        return res.status(401).json({ message: "Invalid token." });
      }

      let updateRequest: UpdateDailyWinRequest = req.body;
      try {
        UpdateDailyWinSchema.parse(updateRequest);
      } catch (err) {
        return res
          .status(400)
          .json({ message: "Incomplete or invalid fields." });
      }

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
          return res.status(403).json({ message: "Unauthorized token." });
        }
      } catch (err) {
        return res.status(404).json({ message: "ID not found." });
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

        return res.status(200).json({
          data: {
            ...dailyWin,
            date: dailyWin.date.toISOString(),
          },
        });
      } else {
        const dailyWin = await prisma.dailyWins.delete({
          where: {
            id: updateRequest.id,
          },
        });

        return res.status(200).json({
          data: {
            ...dailyWin,
            date: dailyWin.date.toISOString(),
          },
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error." });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
}
