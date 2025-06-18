import { itinerarySchema, TripPlanningState } from '../state.js';
import { getOllama } from "../llm/llm.js";


const planDayLlm = getOllama().withStructuredOutput(itinerarySchema, { name: 'get_top_todo_activities' });

export const planDayNode = async (inputState: typeof TripPlanningState.State): Promise<Partial<typeof TripPlanningState.State>> => {

    const activitesDone: string[] = [];

    inputState.itinerary.forEach((day) => {
        activitesDone.push(...day.activities.map(x => x.name));
    });

    const aiMsg = await planDayLlm.invoke([
        [
            "system",
            `Act as travel assistant, you have to plan the intinerary for the provided date for a user on a trip to the provided destination.

                Requirements for planning the itinerary:
                Each activity should be planned one after the other in the day and you should plan for a total of around 12hrs every day roughly from 7 am - 10 pm.
                All activities should be done only once,no repetitions allowed.
                A day should have breakfast lunch and dinner planned.
                Exclude any activity that the user has already done.
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
                The output of the itineray should contain the followingn fields:
                    -day: the date in ISO 8601 date time format, 
                    -activites: list of activities planned for that date.
                        Each activity should contain the 
                            -type of the activity which is meal/adventure/visit
                            -name: The name of the activity
                            -mapLink: The google map link to the location (escape the url so that it is safe in json)
                            -time: The time the activity is planned to start. Should be in ISO 8601 date time format.
                            -duration: The duration the activity would take on an average in hours
                            -cost: The cost per person for that activity
                            -description: The description of the activity (limit the length of the description to a maximum of 15 words)
                            -highlights: The list of key attractions or must experience items during this activity(should not include the activity itself)
                
                You must always return valid JSON fenced by a markdown code block. Do not return any additional text and make sure url's and other special characters are escaped properly"
                `
        ],
        ["human", `I am on a trip in ${inputState.destination} , Can you plan the activites for me to do on ${inputState.dayToPlan}. 
            I have already done the following activities ${activitesDone.join(',') }`],
    ]);

    return {
        // itinerary: inputState.itinerary ? [...inputState.itinerary, aiMsg] : [aiMsg]
        itinerary: [aiMsg]
    };
}