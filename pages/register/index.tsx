import { RegisterSchema, RegisterRequest } from "@/lib/constants/requests";
import { useState } from "react";

export default function RegisterPage() {
  const [request, setRequest] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
  });

  return (
    <div className="wrapper">
      <h1 className="heading relative inline-block">
        <div className="absolute bottom-0 w-full h-[1rem] bg-primary" />
        <span className="relative">Register</span>
      </h1>
      <p className="paragraph">
        Start your journey at DailyWins by filling out the form below!
      </p>
      <form
        onSubmit={(e) => e.preventDefault()}
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
          />
        </div>
        <button type="submit" className="button">Register</button>
      </form>
    </div>
  );
}
