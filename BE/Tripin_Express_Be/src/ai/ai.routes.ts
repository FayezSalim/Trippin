import { Router } from "express";
import { getTodoList } from "./controllers/todo.controller";


export const aiRouter = Router();
aiRouter.get('/todoList', getTodoList);