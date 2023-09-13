import jwt from "jsonwebtoken";
import { env } from "~/env.mjs";
const maxAge = 3 * 60 * 60 * 24;

export const createToken = (id: string) => {
  return jwt.sign({ id }, env.SECRET_KEY, {
    expiresIn: maxAge,
  });
};

export const verifyUser = (token: string) => {
  return jwt.verify(token, env.SECRET_KEY);
};
