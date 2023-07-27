import { LoadingOverlay } from "@mantine/core";
import { useDailyWins } from "@/lib/hooks/useDailyWins";

export default function DailyWins() {
  const { dailyWins, isLoading, isError } = useDailyWins();

  const loadingFlag = isLoading || isError;

  return (
    <div className="wrapper">
      <LoadingOverlay visible={loadingFlag} overlayBlur={2} />
      <h1 className="heading relative inline-block">
        <div className="absolute bottom-0 w-full h-[1rem] bg-primary" />
        <span className="relative">Your Daily Wins</span>
      </h1>
      <div className="mt-[1rem]">
        {dailyWins.length === 0 && (
          <p className="paragraph">
            {"You don't have any daily wins yet for this date. Add one now!"}
          </p>
        )}
        {dailyWins.length > 0 && (
          <div className="flex flex-col gap-[1rem]">
            {dailyWins.map((win) => {
              return (
                <div
                  key={win.id}
                  className="bg-maincontent p-[1rem] drop-shadow-md"
                >
                  <p className="paragraph">{win.content}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
