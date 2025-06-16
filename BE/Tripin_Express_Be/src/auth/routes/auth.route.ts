import { CredentialsSignin, ExpressAuth, ExpressAuthConfig, getSession } from "@auth/express"
import credentials from "@auth/express/providers/credentials";
import bcrypt from "bcryptjs";
import { authDbService } from "../services/auth-db.service";
import { createUser, getUserDetails } from "../controllers/auth.controller";
import { Router, Request, Response, NextFunction } from "express";
import { AuthErrorTypes } from "../models/auth-error-types";
import { User } from "../models/schemas/user.schema";

const expressAuthConfig: ExpressAuthConfig = {
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User> {
        //TODO validate credentials qwithzod npm package

        const userModel = await authDbService.userModel();

        const user = await userModel.findOne({
          email: credentials?.email as any,
        }, ["password"] as any);

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
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = (user as User).userId;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.userId = token.id as string
      return session
    }
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  }
};

export async function authSession(req: Request, res: Response, next: NextFunction) {
  if (req.headers.cookie?.indexOf('authjs.session-token') != -1) {
    res.locals.session = await getSession(req, expressAuthConfig);
  }
  next();
}

// export async function convertRedirectsToErrors(req: Request, res: Response, next: NextFunction) {
//   if (res.statusCode === 302) {
//     res.statusCode = 200;
//   }

//   next();
// }

export const expressAuth = ExpressAuth(expressAuthConfig);


export const authRouter = Router();
authRouter.use(authSession);
authRouter.get('/getUserDetails', getUserDetails);
authRouter.post('/signup', createUser);
authRouter.use(expressAuth);
//authRouter.use(convertRedirectsToErrors);