// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse, AuthenticateResponse } from "@/lib/constants/responses";
import { getUserFromAuthHeader } from "@/lib/api";
import requestIp from "request-ip";
import { checkRateLimit } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthenticateResponse | ErrorResponse>
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

      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
}
