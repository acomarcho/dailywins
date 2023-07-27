import { useState, useEffect } from "react";
import { GetDailyWinsResponse, DailyWin } from "../constants/responses";
import _ from "lodash";
import axios from "axios";

export const useDailyWins = (date: Date) => {
  const [dailyWins, setDailyWins] = useState<DailyWin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get<GetDailyWinsResponse>(
          `/api/daily-wins?date=${_.padStart(
            date!.getFullYear().toString(),
            4,
            "0"
          )}-${_.padStart(
            (date!.getMonth() + 1).toString(),
            2,
            "0"
          )}-${_.padStart(date!.getDate().toString(), 2, "0")}T00:00:00Z`,
          {
            headers: {
              Authorization:
                localStorage.getItem("token") &&
                `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDailyWins(data.data);
      } catch (error) {
        setIsError(true);
        setDailyWins([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [date]);

  return { dailyWins, isLoading, isError, setDailyWins };
};
