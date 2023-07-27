import { z } from "zod";

export const CreateDailyWinSchema = z.object({
  content: z.string().nonempty(),
  date: z.coerce.date(),
});

export type CreateDailyWinRequest = z.infer<typeof CreateDailyWinSchema>;
