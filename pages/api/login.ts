// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ErrorResponse, LoginResponse } from "@/lib/constants/responses";
import { LoginSchema, LoginRequest } from "@/lib/constants/requests";
import { prisma } from "@/lib/db";
import requestIp from "request-ip";
import { checkRateLimit } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse | ErrorResponse>
) {
  if (req.method === "POST") {
    try {
      const ip = requestIp.getClientIp(req);
      if (ip && !(await checkRateLimit(ip))) {
        return res
          .status(429)
          .json({ message: "Rate limit exceeded. Try again in 1 minute." });
      }

      let loginRequest: LoginRequest = req.body;
      try {
        LoginSchema.parse(loginRequest);
      } catch (err) {
        return res.status(400).json({ message: "Incomplete fields" });
      }

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
        const token = await jwt.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          process.env.JWT_SECRET || "foo"
        );
        return res.status(200).json({ token });
      } else {
        return res.status(400).json({ message: "Invalid credentials." });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
}
