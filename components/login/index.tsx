import { LoginSchema, LoginRequest } from "@/lib/constants/requests";
import { LoginResponse } from "@/lib/constants/responses";
import { useState } from "react";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { LoadingOverlay } from "@mantine/core";
import Link from "next/link";

export default function Login() {
  const [request, setRequest] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isRequestValid = () => {
    try {
      LoginSchema.parse(request);
      return true;
    } catch {
      return false;
    }
  };

  const loadingFlag = isLoading;

  return (
    <div className="wrapper">
      <LoadingOverlay visible={loadingFlag} overlayBlur={2} />
      <h1 className="heading relative inline-block">
        <div className="absolute bottom-0 w-full h-[1rem] bg-primary" />
        <span className="relative">Login</span>
      </h1>
      <p className="paragraph">
        Continue your journey at DailyWins by filling out the form below!
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const onSubmit = async () => {
            try {
              setIsLoading(true);
              const { data } = await axios.post<LoginResponse>("/api/login", {
                ...request,
              });
              localStorage.setItem("token", data.token);
              notifications.show({
                withCloseButton: false,
                message: "Welcome back to Daily Wins!",
                color: "teal",
              });
            } catch (error) {
              if (axios.isAxiosError(error)) {
                notifications.show({
                  withCloseButton: false,
                  message: `Login failed! ${error.response?.data.message}`,
                  color: "red",
                });
              } else {
                notifications.show({
                  withCloseButton: false,
                  message: `Login failed! Something went wrong.`,
                  color: "red",
                });
              }
            } finally {
              setIsLoading(false);
            }
          };

          onSubmit();
        }}
        className="mt-[1rem] flex flex-col gap-[1rem]"
      >
        <div className="flex flex-col gap-[0.25rem]">
          <label htmlFor="email" className="paragraph font-bold">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="px-[1rem] py-[0.5rem] drop-shadow-lg paragraph"
            placeholder="johndoe@gmail.com"
            value={request.email}
            onChange={(e) =>
              setRequest({ ...request, email: e.currentTarget.value })
            }
          />
        </div>
        <div className="flex flex-col gap-[0.25rem]">
          <label htmlFor="password" className="paragraph font-bold">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="px-[1rem] py-[0.5rem] drop-shadow-lg paragraph"
            placeholder=""
            value={request.password}
            onChange={(e) =>
              setRequest({ ...request, password: e.currentTarget.value })
            }
          />
        </div>
        <button
          type="submit"
          className="button mt-[1rem]"
          disabled={isLoading || !isRequestValid()}
        >
          Login
        </button>
      </form>
      <Link href="/register" className="paragraph inline-block mt-[0.5rem]">
        No account yet? <span className="text-primary-700">Register</span>
      </Link>
    </div>
  );
}
