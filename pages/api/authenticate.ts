// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { ErrorResponse, AuthenticateResponse } from "@/lib/constants/responses";
import { parseToken } from "@/lib/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthenticateResponse | ErrorResponse>
) {
  if (req.method === "GET") {
    try {
      if (!req.headers.authorization) {
        return res.status(401).end();
      }

      const token = parseToken(req.headers.authorization);

      type User = {
        name: string;
        email: string;
        password: string;
      };
      let decodedUser: User;

      try {
        decodedUser = (await jwt.verify(
          token,
          process.env.JWT_SECRET || "foo"
        )) as User;
      } catch {
        return res.status(401).end();
      }

      const prisma = new PrismaClient();

      const user = await prisma.user.findUnique({
        where: {
          email: decodedUser.email,
        },
      });
      if (!user) {
        return res.status(401).end();
      }

      return res.status(200).json({
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  } else {
    return res.status(405).end();
  }
}
