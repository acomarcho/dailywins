// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

type ErrorResponse = {
  message: string;
};

type LoginResponse = {
  token: string;
};

const LoginRequest = z.object({
  email: z.string().nonempty(),
  password: z.string().nonempty(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse | ErrorResponse>
) {
  if (req.method === "POST") {
    try {
      let loginRequest: z.infer<typeof LoginRequest> = req.body;
      try {
        LoginRequest.parse(loginRequest);
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
        return res
          .status(200)
          .json({ message: "Succesfully logged in." });
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
