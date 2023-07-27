import { z } from "zod";

export const LoginRequest = z.object({
  email: z.string().nonempty(),
  password: z.string().nonempty(),
});
