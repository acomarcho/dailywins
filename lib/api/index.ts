import { prisma } from "../db";
import jwt from "jsonwebtoken";
import { parseToken } from "@/lib/utils";

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
