import { Annotation } from "@langchain/langgraph";
import { deepMerge } from "../merge.js";
import z from "zod";


export interface Itinerary {
    date: string;
    activities: Activity[];
}

export interface Activity {
    type: Type;
    name: string;
    mapLink: string;
    time: string;
    duration: number;
    cost: number;
    description: string;
    highlights: string[];
}

export enum Type {
    Adventure = "adventure",
    Meal = "meal",
    Visit = "visit",
}

export const itinerarySchema = z.object({
    //date: z.coerce.date().describe("The date of this itinerary"),
    date: z.string().describe("The date of this itinerary"),
    activities: z.array(
        z.object({
            type: z.enum([Type.Adventure, Type.Meal, Type.Visit]).describe("The type of the activity meal/adventure/visit"),
            name: z.string().describe("The name of the activity"),
            mapLink: z.string().describe("The google map link to the location"),
            //time: z.coerce.date().describe("The time the activity is planned to start"),
            time: z.string().describe("The time the activity is planned to start"),
            duration: z.number().describe("The duration the activity would take on an average in hours"),
            cost: z.number().describe("The cost per person for that activity"),
            description: z.string().describe("The description for the activity"),
            highlights: z.array(
                z.string().describe("The name of the highlight")
            ).describe("The must look out for or expereince items during this activity")
        }).describe("A single activity")
    ).describe("The list of activities planned for the day")
});

export const TripPlanningInput = Annotation.Root({
    destination: Annotation<string>,
    startDate: Annotation<string>,
    endDate: Annotation<string>,
    preferredActivities: Annotation<string[]>,
    budget: Annotation<number>,
});

export const TripPlanningState = Annotation.Root({
    destination: Annotation<string>,
    startDate: Annotation<string>,
    endDate: Annotation<string>,
    preferredActivities: Annotation<string[]>,
    budget: Annotation<number>,
    // itinerary: Annotation<Itinerary[]>({
    //     reducer: (currValue, update) => {
    //         return deepMerge(currValue, update)
    //     }
    // }),
    itinerary: Annotation<Itinerary[]>({
        reducer: (a, b) => a.concat(b),
        default: () => []
    }),
    possibleActivites: Annotation<string[]>,
    daysToPlanFor: Annotation<string[]>,
    dayToPlan: Annotation<string>
});

export const TripItinerary = Annotation.Root({
    destination: Annotation<string>,
    itinerary: Annotation<Itinerary[]>,
    possibleActivites: Annotation<string[]>,
    text: Annotation<string>
});




