import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../atoms/user";
import { AuthenticateResponse } from "../constants/responses";
import axios from "axios";

export const useUserWithFetch = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get<AuthenticateResponse>(
          "/api/authenticate",
          {
            headers: {
              Authorization:
                localStorage.getItem("token") &&
                `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
        });
      } catch (error) {
        setIsError(true);
        setUser({
          id: -1,
          name: "",
          email: "",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [setUser]);

  return { user, isLoading, isError, setUser };
};

export const useUser = () => {
  const [user, setUser] = useAtom(userAtom);
  return { user, setUser };
};
