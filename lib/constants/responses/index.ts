export type ErrorResponse = {
  message: string;
};

export * from "./login";
export * from "./register";

export type BaseResponse<T> = {
  data: T;
};
