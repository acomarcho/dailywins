import { z } from "zod";

export const CreateDailyWinSchema = z.object({
  content: z.string().nonempty(),
  date: z.coerce.date(),
});

export type CreateDailyWinRequest = z.infer<typeof CreateDailyWinSchema>;

export const UpdateDailyWinSchema = z.object({
  id: z.number(),
  content: z.string().nonempty(),
  delete: z.boolean(),
});

export type UpdateDailyWinRequest = z.infer<typeof UpdateDailyWinSchema>;
