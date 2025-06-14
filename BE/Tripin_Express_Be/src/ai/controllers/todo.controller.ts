import { NextFunction, Response, Request } from "express";
import { todoAgent } from "../agents/todo.agent";


export const getTodoList = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.query as any;
    const todoActivities = await todoAgent.getActivitiesTodo(data.place, new Date(data['startDate']), new Date(data['endDate']));
    res.status(201).json(todoActivities);
};
