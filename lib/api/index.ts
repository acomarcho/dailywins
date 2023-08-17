import { prisma } from "../db";
import jwt from "jsonwebtoken";
import { parseToken } from "@/lib/utils";
import { redis } from "../redis/redis";

type User = {
  id: number;
  name: string;
  email: string;
};

export const getUserFromAuthHeader = async (authHeader: string) => {
  const noUser: User = {
    id: -1,
    name: "",
    email: "",
  };

  try {
    const token = parseToken(authHeader);

    let decodedUser: User;

    try {
      decodedUser = (await jwt.verify(
        token,
        process.env.JWT_SECRET || "foo"
      )) as User;
    } catch {
      return noUser;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: decodedUser.email,
      },
    });
    if (!user) {
      return noUser;
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  } catch {
    return noUser;
  }
};

export const checkRateLimit = async (ip: string) => {
  const client = await redis.getClient();
  const connections = await client.get(ip);
  if (connections) {
    const limit =
      (process.env.REQUEST_LIMIT && parseInt(process.env.REQUEST_LIMIT)) || 60;
    if (parseInt(connections) > limit) {
      return false;
    }
    await client.incr(ip);
  } else {
    await client.setEx(ip, 60, "1");
  }
  return true;
};
