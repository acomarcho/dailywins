import { atom } from "jotai";

export type User = {
  name: string;
  email: string;
};

export const userAtom = atom({
  name: "",
  email: "",
});
