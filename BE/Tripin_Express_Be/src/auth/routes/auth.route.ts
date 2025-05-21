import { CredentialsSignin, ExpressAuth, ExpressAuthConfig, getSession } from "@auth/express"
import credentials from "@auth/express/providers/credentials";
import bcrypt from "bcryptjs";
import { authDbService } from "../services/auth-db.service";
import { createUser, getItems } from "../controllers/auth.controller";
import { Router, Request, Response, NextFunction } from "express";
import { AuthErrorTypes } from "../models/auth-error-types";

const expressAuthConfig: ExpressAuthConfig = {
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        //validate credentials qwithzod npm package

        const userModel = await authDbService.userModel();

        const user = await userModel.findOne({
          email: credentials?.email,
        }).select("+password");

        if (!user) throw new CredentialsSignin("Wrong Email/Password", { cause: AuthErrorTypes.InvalidCredentials });

        const passwordMatch = await bcrypt.compare(
          credentials!.password as any,
          user.password
        );

        if (!passwordMatch) throw new CredentialsSignin("Wrong Email/Password", { cause: AuthErrorTypes.InvalidCredentials });
        return user;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  }
};

export async function authSession(req: Request, res: Response, next: NextFunction) {
  res.locals.session = await getSession(req, expressAuthConfig);
  next();
}

export async function convertRedirectsToErrors(req: Request, res: Response, next: NextFunction) {
  if (res.statusCode === 302) {
    res.statusCode = 200;
  }

  next();
}

export const authOptions = ExpressAuth(expressAuthConfig);


export const authRouter = Router();
authRouter.use(authSession);
authRouter.get('/test', getItems);
authRouter.post('/signup', createUser);
authRouter.use(authOptions);
authRouter.use(convertRedirectsToErrors);