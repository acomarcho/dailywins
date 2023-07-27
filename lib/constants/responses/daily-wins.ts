export type DailyWin = {
  id: number;
  userId: number;
  content: string;
  date: string;
};

export type GetDailyWinsResponse = {
  data: DailyWin[];
};

export type CreateDailyWinResponse = {
  data: DailyWin;
};

export type UpdateDailyWinResponse = {
  data: DailyWin;
};
