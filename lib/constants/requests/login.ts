import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().nonempty(),
  password: z.string().nonempty(),
});

export type LoginRequest = z.infer<typeof LoginSchema>;
