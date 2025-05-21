import { Request, Response, NextFunction } from "express";
import { Credentials } from "../models/credentials";
import { authDbService } from "../services/auth-db.service";
import bcrypt from "bcryptjs";


export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credentials: Credentials = req.body;
    //TODO validate credential with zod
    
    var salt = await bcrypt.genSalt();
    credentials.password = await bcrypt.hash(credentials.password, salt);
    const userModel = await authDbService.userModel();
    await userModel.create(credentials);

    const user = await userModel.findOne({
      email: credentials?.email,
    }).select("+password");

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const getItems = (req: Request, res: Response, next: NextFunction) => {
  try {
    //getSession(req)
    if (res.locals.session) {
      res.json(`Session is set ${res.locals.session}`);
    } else {
      res.json("Session is not set");
    }
  } catch (error) {
    next(error);
  }
};