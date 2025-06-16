import { Router } from "express";
import { createTrip,getTrip } from "../controllers/trip.controller";

export const tripManagementRouter = Router();
tripManagementRouter.get('/trip', getTrip);
tripManagementRouter.post('/trip', createTrip);