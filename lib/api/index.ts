import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { parseToken } from "@/lib/utils";

type User = {
  name: string;
  email: string;
};

export const getUserFromAuthHeader = async (authHeader: string) => {
  const noUser: User = {
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

    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: {
        email: decodedUser.email,
      },
    });
    if (!user) {
      return noUser;
    }
    return user;
  } catch {
    return noUser;
  }
};
