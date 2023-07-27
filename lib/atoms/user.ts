import { atom } from "jotai";

export type User = {
  id: number;
  name: string;
  email: string;
};

export const userAtom = atom({
  id: -1,
  name: "",
  email: "",
});
