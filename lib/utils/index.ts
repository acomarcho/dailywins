export const parseToken = (token: string) => {
  if (token.startsWith("Bearer")) {
    const splitToken = token.split(" ")[1];
    return splitToken;
  } else {
    return token;
  }
};
