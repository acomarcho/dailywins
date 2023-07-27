import { useState } from "react";
import { LoadingOverlay } from "@mantine/core";
import { useDailyWins } from "@/lib/hooks/useDailyWins";
import { Modal } from "@mantine/core";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { CreateDailyWinResponse } from "@/lib/constants/responses";

export default function DailyWins() {
  const { dailyWins, setDailyWins, isLoading, isError } = useDailyWins();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);

  const loadingFlag = isLoading || isError || isRequesting;

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
      <div className="mt-[1rem]">
        <button
          className="button"
          onClick={() => {
            setIsModalOpen(true);
            setContent("");
          }}
        >
          Add new daily win
        </button>
      </div>
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        withCloseButton={false}
        centered={true}
      >
        <div className="p-[1rem]">
          <h1 className="heading">Add new win</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const request = async () => {
                try {
                  setIsRequesting(true);
                  const { data } = await axios.post<CreateDailyWinResponse>(
                    "/api/daily-wins",
                    {
                      content,
                      date: new Date().toISOString(),
                    },
                    {
                      headers: {
                        Authorization:
                          localStorage.getItem("token") &&
                          `Bearer ${localStorage.getItem("token")}`,
                      },
                    }
                  );
                  setDailyWins([...dailyWins, data.data]);
                  setIsModalOpen(false);
                  notifications.show({
                    message: "Successfully added daily win!",
                    withCloseButton: false,
                    color: "teal",
                  });
                } catch (error) {
                  notifications.show({
                    message: "Failed to add daily win!",
                    withCloseButton: false,
                    color: "red",
                  });
                } finally {
                  setIsRequesting(false);
                }
              };

              request();
            }}
            className="mt-[1rem]"
          >
            <div className="flex flex-col gap-[0.25rem]">
              <label htmlFor="content" className="paragraph font-bold">
                Content <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="content"
                className="paragraph bg-white px-[1rem] py-[0.5rem] drop-shadow-lg"
                placeholder="I jogged for 30 minutes today!"
                value={content}
                onChange={(e) => {
                  setContent(e.currentTarget.value);
                }}
              />
            </div>
            <div className="mt-[2rem]">
              <button type="submit" className="button" disabled={!content}>
                Add win
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
