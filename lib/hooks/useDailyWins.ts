import { useState, useEffect } from "react";
import { GetDailyWinsResponse, DailyWin } from "../constants/responses";
import axios from "axios";

export const useDailyWins = () => {
  const [dailyWins, setDailyWins] = useState<DailyWin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get<GetDailyWinsResponse>(
          "/api/daily-wins",
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
  }, []);

  return { dailyWins, isLoading, isError, setDailyWins };
};
