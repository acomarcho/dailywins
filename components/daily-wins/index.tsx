import { useState } from "react";
import { LoadingOverlay } from "@mantine/core";
import { useDailyWins } from "@/lib/hooks/useDailyWins";
import { Modal } from "@mantine/core";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import {
  CreateDailyWinResponse,
  UpdateDailyWinResponse,
} from "@/lib/constants/responses";
import { IconX, IconEdit } from "@tabler/icons-react";

export default function DailyWins() {
  const { dailyWins, setDailyWins, isLoading, isError } = useDailyWins();
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [content, setContent] = useState("");
  const [selectedId, setSelectedId] = useState(-1);
  const [isRequesting, setIsRequesting] = useState(false);

  const loadingFlag = isLoading || isError || isRequesting;

  return (
    <div className="wrapper min-h-[calc(100vh-4rem)]">
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
                  <div className="flex w-full justify-between items-center">
                    <p className="paragraph max-w-[60%]">{win.content}</p>
                    <div className="flex gap-[1rem]">
                      <button>
                        <IconX
                          onClick={() => {
                            setIsDeleting(true);
                            setSelectedId(win.id);
                          }}
                        />
                      </button>
                      <button>
                        <IconEdit
                          onClick={() => {
                            setIsUpdating(true);
                            setContent(win.content);
                            setSelectedId(win.id);
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="mt-[2rem]">
        <button
          className="button"
          onClick={() => {
            setIsCreating(true);
            setContent("");
          }}
        >
          Add new daily win
        </button>
      </div>
      <Modal
        opened={isCreating}
        onClose={() => setIsCreating(false)}
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
                  setIsCreating(false);
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
      <Modal
        opened={isDeleting}
        onClose={() => setIsDeleting(false)}
        withCloseButton={false}
        centered={true}
      >
        <div className="p-[1rem]">
          <h1 className="heading">Delete win</h1>
          <p className="paragraph mt-[0.5rem]">
            Are you sure to delete the win with content{" "}
            {`"${dailyWins.find((win) => win.id === selectedId)?.content}"?`}
          </p>
          <button
            className="button mt-[2rem]"
            onClick={() => {
              const request = async () => {
                try {
                  setIsRequesting(true);
                  const { data } = await axios.put<UpdateDailyWinResponse>(
                    "/api/daily-wins",
                    {
                      id: selectedId,
                      content:
                        dailyWins.find((win) => win.id === selectedId)
                          ?.content || "Placeholder content",
                      delete: true,
                    },
                    {
                      headers: {
                        Authorization:
                          localStorage.getItem("token") &&
                          `Bearer ${localStorage.getItem("token")}`,
                      },
                    }
                  );
                  setDailyWins(
                    dailyWins.filter((win) => win.id !== data.data.id)
                  );
                  setIsDeleting(false);
                  notifications.show({
                    message: "Win successfully deleted!",
                    color: "teal",
                    withCloseButton: false,
                  });
                } catch (error) {
                  notifications.show({
                    message: "Failed to delete win!",
                    color: "red",
                    withCloseButton: false,
                  });
                } finally {
                  setIsRequesting(false);
                }
              };

              request();
            }}
          >
            Yes, proceed
          </button>
        </div>
      </Modal>
      <Modal
        opened={isUpdating}
        onClose={() => setIsUpdating(false)}
        withCloseButton={false}
        centered={true}
      >
        <div className="p-[1rem]">
          <h1 className="heading">Update win</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const request = async () => {
                try {
                  setIsRequesting(true);
                  const { data } = await axios.put<UpdateDailyWinResponse>(
                    "/api/daily-wins",
                    {
                      id: selectedId,
                      content: content,
                      delete: false,
                    },
                    {
                      headers: {
                        Authorization:
                          localStorage.getItem("token") &&
                          `Bearer ${localStorage.getItem("token")}`,
                      },
                    }
                  );
                  setDailyWins(
                    dailyWins.map((win) => {
                      if (win.id === data.data.id) {
                        return { ...win, content: data.data.content };
                      } else {
                        return win;
                      }
                    })
                  );
                  setIsUpdating(false);
                  notifications.show({
                    message: "Successfully updated win!",
                    withCloseButton: false,
                    color: "teal",
                  });
                } catch (error) {
                  notifications.show({
                    message: "Failed to update win!",
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
