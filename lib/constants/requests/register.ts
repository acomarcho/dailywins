import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().nonempty(),
  password: z.string().nonempty(),
});

export type RegisterRequest = z.infer<typeof RegisterSchema>;
