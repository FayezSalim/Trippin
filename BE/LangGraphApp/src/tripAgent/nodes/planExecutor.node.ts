
import { TripPlanningState } from "../state.js";


export const planExecutorNode = (inputState: typeof TripPlanningState.State): Partial<typeof TripPlanningState.State> => {
    const dayToPlan = inputState.daysToPlanFor[0];
    inputState.daysToPlanFor.splice(0, 1);

    return {
        dayToPlan: dayToPlan,
        daysToPlanFor: inputState.daysToPlanFor
    };
}


export function isItineraryComplete(state: typeof TripPlanningState.State) {
    return state.daysToPlanFor.length == 0 ? "true" : "false";
}