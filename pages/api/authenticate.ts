// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse, AuthenticateResponse } from "@/lib/constants/responses";
import { getUserFromAuthHeader } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthenticateResponse | ErrorResponse>
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
