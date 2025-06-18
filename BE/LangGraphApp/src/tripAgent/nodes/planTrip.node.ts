import { getOllama } from "../llm/llm.js";
import { TripPlanningInput, TripPlanningState } from "../state.js";
import z from "zod";

const tripPlanSchema = z.object({
    days: z.array(
        z.string().describe("The date of a single day in the trip")
    ).describe("The list of days in the trip")
}).describe("The birds eye view of the trip plan");

//in future to handel travel between cities,or split areas of city to focus per day etc

export const planTripNode = async (inputState: typeof TripPlanningInput.State): Promise<Partial<typeof TripPlanningState.State>> => {

    const aiMsg = await planDayLlm.invoke([
        [
            "system",
            `Act as travel assistant, you have to list out the number of days in the trip.You will be given a start date and end date.

            ### Output Structure
                You should return a JSON object containing a single field days, the days field should contain all the dates during the trip

            You must always return valid JSON fenced by a markdown code block. Do not return any additional text and make sure url's and other special characters are escaped properly"
            `
        ],
        ["human", `I would like to visit ${inputState.destination} from ${inputState.startDate} to ${inputState.endDate}. Can you prepare a high level plan for me?.`],
    ]);

    return { daysToPlanFor: [...aiMsg.days] };
}


const planDayLlm = getOllama().withStructuredOutput(tripPlanSchema, { name: 'trip_plan' });