import { Router } from "express";
import { createTrip } from "../controllers/trip.controller";


export const tripManagementRouter = Router();
tripManagementRouter.get('/createTrip', createTrip);