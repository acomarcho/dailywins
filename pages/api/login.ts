// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ErrorResponse, LoginResponse } from "@/lib/constants/responses";
import { LoginSchema, LoginRequest } from "@/lib/constants/requests";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse | ErrorResponse>
) {
  if (req.method === "POST") {
    try {
      let loginRequest: LoginRequest = req.body;
      try {
        LoginSchema.parse(loginRequest);
      } catch (err) {
        return res.status(400).json({ message: "Incomplete fields" });
      }

      const prisma = new PrismaClient();

      const user = await prisma.user.findUnique({
        where: {
          email: loginRequest.email,
        },
      });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials." });
      }

      const isMatch = await bcrypt.compare(
        loginRequest.password,
        user.password
      );
      if (isMatch) {
        const token = await jwt.sign(user, process.env.JWT_SECRET || "foo");
        return res.status(200).json({ token });
      } else {
        return res.status(400).json({ message: "Invalid credentials." });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  } else {
    return res.status(405).end();
  }
}
