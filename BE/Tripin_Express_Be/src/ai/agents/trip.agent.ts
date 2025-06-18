import { Runnable } from "@langchain/core/runnables";
import { ollamaService } from "../llm/ollama.service";
import z from "zod";


const itinerarySchema = z.object({
    name: z.string().describe("The name of the destination city/country"),
    itinerary: z.array(
        z.object({
            date: z.coerce.date().describe("The date of this itinerary"),
            activities: z.array(
                z.object({
                    type: z.string().describe("The type of the activity meal/adventure/visit"),
                    location: z.string().describe("The location of the activity"),
                    mapLink: z.string().describe("The google map link to the location"),
                    time: z.coerce.date().describe("The time the activity is planned to start"),
                    duration: z.number().describe("The duration the activity would take on an average in hours"),
                    cost: z.number().describe("The cost per person for that activity"),
                    description: z.string().describe("The description for the activity"),
                    highlights: z.array(
                        z.string().describe("The name of the highlight")
                    ).describe("The must look out for or expereince items during this activity")
                }).describe("A single activity")
            ).describe("The list of activities planned for the day")
        }).describe("The itinerary of a day during the trip")
    ).describe("The list of day wise itinerary of the trip")
});


type itinerary = z.infer<typeof itinerarySchema>;





export class TripAgent {
    private llm!: Runnable<any, any>;


    constructor() {
        this.init();
    }

    private async init() {

        this.llm = ollamaService.getOllama().withStructuredOutput(itinerarySchema, { name: 'plan_trip' });

    }

    // TODO what happens when multiple requests are made to the same instance of llm, can it support multi threading and maintain separate contexts?
    public async planTrip(place: string, startDate: Date, endDate: Date, preferredActivites: []): Promise<itinerary> {

        const aiMsg = await this.llm.invoke([
            [
                "system",
                `Act as travel assistant that plans a detailed trip itinerary to the specified city/country for the duration of the days mentioned.
                The user will also give a list of preferred activites which has to be prioritized in the trip.
                Be creative and plan for the rest of the available time.You have the freedom to order the itinerary in the best way possible by considering the below requirements.

                Requirements for planning the itinerary:
                Plan for each day in the duration of the trip separately.
                Every day should have maximum number of activities possible in a day.
                All activities should be done only once,no repetitions allowed.
                Each activity should be planned one after the other in the day and you should plan for a total of around 12hrs every day roughly from 8 am - 10 pm.
                Exclude the time to sleep(usually 12 am to 6 am) from the plan. Unless the activity can only be done in the night, for example: night trekking,camping etc
                You must include breakfast,lunch and dinner.
                Categorize every activity into the following types:
                    1.meal: where you find a well rated dining place nearby the last activity
                        -breakfast should be ideally planned in between 7am to 9am
                        -lunch should be ideally planned in between 12pm to 2pm
                        -dinner should be ideally planned in between 8pm to 10pm
                    2.adventure : an adventure activity like paragliding,trekking,scuba diving etc.
                    3.visit: visiting malls,museuems,forts,historical cites or any other buildings/places
                You have to make sure that the itinerary optimizes travel by planning each activity with as close proximity as possible to each other.
                You also have to consider the best time of the day for an activity.
               

                Output:
                The output of the itineray should contain all days in the duration given by the user.
                    Each day should contain the date in ISO 8601 date time format, 
                    And it should only contain the list of activities to be done on that date.
                    Each activity should contain the 
                        -type of the activity which is meal/adventure/visit
                        -location: The location of the activity
                        -mapLink: The google map link to the location (escape the url so that it is safe in json)
                        -time: The time the activity is planned to start. Should be in ISO 8601 date time format.
                        -duration: The duration the activity would take on an average in hours
                        -cost: The cost per person for that activity
                        -description: The description of the activity (limit the length of the description to a maximum of 15 words)
                        -highlights: The list of key attractions or must experience items during this activity(should not include the activity itself)
                
                You must always return valid JSON fenced by a markdown code block. Do not return any additional text and make sure url's and other special characters are escaped properly"
                `
            ],
            ["human", `I would like to visit ${place} from ${startDate} to ${endDate}. Can you prepare an itinerary for me?.`],
        ]);

        //output verification and parsing 
        //https://medium.com/@docherty/mastering-structured-output-in-llms-choosing-the-right-model-for-json-output-with-langchain-be29fb6f6675
        return aiMsg;
    }

}


export const tripAgent = new TripAgent();