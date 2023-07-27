import { z } from "zod";

export const RegisterRequest = z.object({
  name: z.string().nonempty(),
  email: z.string().nonempty(),
  password: z.string().nonempty(),
});
