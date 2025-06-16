import { NextFunction, Request, Response } from "express";
import { tripDbService } from "../services/trip-dp.service";


export const createTrip = async (req: Request, res: Response, next: NextFunction) => {
    const tripModel = await tripDbService.tripModel();
    const trip = await tripModel.create({ ...req.body, ownerId:res.locals.session.userId, totalCost: 0, budget: req.body.budget ?? 0 });
    res.status(201).json(trip.tripId);
};

export const getTrip = async (req: Request, res: Response, next: NextFunction) => {

    const data = req.query as any;
    res.status(201).json("got trip");
};