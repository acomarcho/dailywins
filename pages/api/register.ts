// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { ErrorResponse, RegisterResponse } from "@/lib/constants/responses";
import { RegisterSchema, RegisterRequest } from "@/lib/constants/requests";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse | ErrorResponse>
) {
  if (req.method === "POST") {
    try {
      let registerRequest: RegisterRequest = req.body;
      try {
        RegisterSchema.parse(registerRequest);
      } catch (err) {
        return res.status(400).json({ message: "Incomplete or invalid fields." });
      }

      const prisma = new PrismaClient();

      const user = await prisma.user.findUnique({
        where: {
          email: registerRequest.email,
        },
      });
      if (user) {
        return res.status(400).json({ message: "Email already taken." });
      }

      const hashedPassword = await bcrypt.hash(registerRequest.password, 12);

      await prisma.user.create({
        data: {
          ...registerRequest,
          password: hashedPassword,
        },
      });

      return res.status(200).json({ message: "Account successfully created." });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  } else {
    return res.status(405).end();
  }
}
