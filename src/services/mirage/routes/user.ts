import { Response, Request } from "miragejs";
import { handelError } from "../server";

import { randomBytes } from "crypto";
import { User } from "../../../interfaces/user.interface";

const generateToken = () => randomBytes(8).toString("hex");

export interface AuthResponse {
  token: string;
  user: User;
}

const login = (schema: any, req: Request): AuthResponse | Response => {
  const { username, password } = JSON.parse(req.requestBody);
  const user = schema.users.findBy({ username });

  if (!user) {
    return handelError(null, "No user with that username exists");
  }
  if (password !== user.password) {
    return handelError(null, "Password does not match");
  }
  const token = generateToken();
  return {
    user: user.attrs as User,
    token,
  };
};

const signup = (schema: any, req: Request): AuthResponse | Response => {
  const data = JSON.parse(req.requestBody);
  const existingUser = schema.users.findBy({ username: data.username });
  if (existingUser) {
    return handelError(null, "User already exists");
  }

  const user = schema.users.create(data);
  const token = generateToken();
  return {
    user: user.attr as User,
    token,
  };
};

export default {
  login,
  signup,
};
