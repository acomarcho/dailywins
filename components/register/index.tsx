import { RegisterSchema, RegisterRequest } from "@/lib/constants/requests";
import { RegisterResponse } from "@/lib/constants/responses";
import { useState } from "react";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { LoadingOverlay } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Register() {
  const [request, setRequest] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const isRequestValid = () => {
    try {
      RegisterSchema.parse(request);
      return true;
    } catch {
      return false;
    }
  };

  const loadingFlag = isLoading;

  return (
    <div className="wrapper min-h-[calc(100vh-4rem)]">
      <LoadingOverlay visible={loadingFlag} overlayBlur={2} />
      <h1 className="heading relative inline-block">
        <div className="absolute bottom-0 w-full h-[1rem] bg-primary" />
        <span className="relative">Register</span>
      </h1>
      <p className="paragraph">
        Start your journey at DailyWins by filling out the form below!
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const onSubmit = async () => {
            try {
              setIsLoading(true);
              await axios.post<RegisterResponse>("/api/register", {
                ...request,
              });
              notifications.show({
                withCloseButton: false,
                message:
                  "Successfully registered! You can now log in to your account.",
                color: "teal",
              });
              router.push("/login");
            } catch (error) {
              if (axios.isAxiosError(error)) {
                notifications.show({
                  withCloseButton: false,
                  message: `Register failed! ${error.response?.data.message}`,
                  color: "red",
                });
              } else {
                notifications.show({
                  withCloseButton: false,
                  message: `Register failed! Something went wrong.`,
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
          <label htmlFor="name" className="paragraph font-bold">
            Name
          </label>
          <input
            type="text"
            name="name"
            className="px-[1rem] py-[0.5rem] drop-shadow-lg paragraph"
            placeholder="John Doe"
            value={request.name}
            onChange={(e) =>
              setRequest({ ...request, name: e.currentTarget.value })
            }
          />
        </div>
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
          Register
        </button>
      </form>
      <Link href="/login" className="paragraph inline-block mt-[0.5rem]">
        Already have an account?{" "}
        <span className="text-primary-700">Log in</span>
      </Link>
    </div>
  );
}
