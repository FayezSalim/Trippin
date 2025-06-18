import { NextFunction, Request, Response } from "express";
import { tripDbService } from "../services/trip-dp.service";
import { tripAgent } from "../../ai/agents/trip.agent";


export const createTrip = async (req: Request, res: Response, next: NextFunction) => {
    const tripModel = await tripDbService.tripModel();
    //const trip = await tripModel.create({ ...req.body, ownerId:res.locals.session.userId, totalCost: 0, budget: req.body.budget ?? 0 });

    var result = await tripAgent.planTrip(req.body.destination, new Date(req.body.startDate), new Date(req.body.endDate), req.body.preferredActivites);

    result.itinerary.forEach((day) => {
        day.activities.sort((x, y) => x.time.getTime() - y.time.getTime());
    });

    result.itinerary.sort((x, y) => x.date.getTime() - y.date.getTime());

    res.status(201).json(result);
};

export const getTrip = async (req: Request, res: Response, next: NextFunction) => {
    //paginate days
    const data = req.query as any;
    res.status(201).json("got trip");
};