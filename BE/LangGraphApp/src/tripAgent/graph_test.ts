// import { StateGraph } from "@langchain/langgraph";
// import { TripPlanningInput, TripPlanningState, TripItinerary, Type } from "./state.js";
// import { ChatOllama } from "@langchain/ollama";
// import z from "zod";
// import { getOllama } from "./llm/llm.js";

// const tripPlannningSystemGraph = new StateGraph({
//     stateSchema: TripPlanningState,
//     input: TripPlanningInput,
//     output: TripItinerary
// });


// // const todoSchema = z.object({
// //     destination: z.string().describe("The name of the city/country"),
// //     activities: z.array(z.object({
// //         name: z.string().describe("The name of the activity, should contain only two words and a maximum of 15 characters")
// //         //icon: z.string().describe("The relevant emoji that can represent this activity")
// //     })).describe("The activities that can be done in the city/country")
// // });

// // const todoSchema = z.array(z.string().describe("The name of the activity")).describe("List of activities to do");

// const todoSchema = z.object({
//     destination: z.string().describe("The name of the destination"),
//     activities: z.array(z.object({
//         name: z.string().describe("The name of the activity, should contain only two words and a maximum of 15 characters"),
//         icon: z.string().describe("The relevant emoji that can represent this activity")
//     })).describe("The activities that can be done in the destination")
// });


// const explorePossibleActivites = async (inputState: typeof TripPlanningInput.State): Promise<Partial<typeof TripPlanningState.State>> => {


//     try {
//         const aiMsg = await llmwithStructuredOutput.invoke([
//             [
//                 "system",
//                 `Act as travel assistant that suggests the 20 most popular things to do when on a trip to that specific destination.
//                 Summarize the things to do into tags that can be displayed on a web application.               
                
//                 ### Output Details:
//                 You must always return valid JSON block. Do not return any additional text and make sure url's and other special characters are escaped properly.
//                 The JSON object should have the following fields
//                     -destination :  containing the name of the destination 
//                     -activities:  which is an array of the top 20 suggestions.
//                         -Each item in the array containing the fields name and icon.
//                             -name field of the activity can have a maximum of upto three words with a maximum length of 10 characters.
//                             -icon field should have a single emoji associated with that activity.   
                            
//                 ### Example Output:
//                 \` 
//                 {
//                     "destination": "New York",
//                     "activities": [
//                         {
//                             "name": "Activity 1",
//                             "icon": "🎨"
//                         },
//                         {
//                             "name": "Activity 2",
//                             "icon": "🕉️"
//                         },
//                         {
//                             "name": "Activity 3",
//                             "icon": "🎬"
//                         }
//                     ]
//                 }
//                 \`
//                 `
//             ],
//             ["human", `I would like to visit ${inputState.destination} from ${inputState.startDate} to ${inputState.endDate}. Can you suggest me what all activities can I do.`],
//         ]);


//         return { possibleActivites: aiMsg.activities.map(x => x.name), itinerary: [], text: JSON.stringify(aiMsg) };
//         // return { itinerary: [], text: JSON.stringify(aiMsg) };

//     } catch (err) {
//         throw new Error("Error while executing llm " + JSON.stringify(err));
//     }
//     //return { possibleActivites: ['1', '2'], itinerary: [] };
// }


// const planTrip = async (inputState: typeof TripPlanningState.State): Promise<Partial<typeof TripPlanningState.State>> => {

//     const aiMsg = await planTripLlm.invoke([
//         [
//             "system",
//             `Act as travel assistant that plans a detailed trip itinerary to the specified city/country for the duration of the days mentioned.
//                 The user will also give a list of preferred activites which has to be prioritized in the trip.
//                 Be creative and plan for the rest of the available time.You have the freedom to order the itinerary in the best way possible by considering the below requirements.

//                 Requirements for planning the itinerary:
//                 Plan for each day in the duration of the trip separately.
//                 Every day should have maximum number of activities possible in a day.
//                 All activities should be done only once,no repetitions allowed.
//                 Each activity should be planned one after the other in the day and you should plan for a total of around 12hrs every day roughly from 8 am - 10 pm.
//                 Exclude the time to sleep(usually 12 am to 6 am) from the plan. Unless the activity can only be done in the night, for example: night trekking,camping etc
//                 You must include breakfast,lunch and dinner.
//                 Categorize every activity into the following types:
//                     1.meal: where you find a well rated dining place nearby the last activity
//                         -breakfast should be ideally planned in between 7am to 9am
//                         -lunch should be ideally planned in between 12pm to 2pm
//                         -dinner should be ideally planned in between 8pm to 10pm
//                     2.adventure : an adventure activity like paragliding,trekking,scuba diving etc.
//                     3.visit: visiting malls,museuems,forts,historical cites or any other buildings/places
//                 You have to make sure that the itinerary optimizes travel by planning each activity with as close proximity as possible to each other.
//                 You also have to consider the best time of the day for an activity.
               

//                 Output:
//                 The output of the itineray should contain all days in the duration given by the user.
//                     Each day should contain the date in ISO 8601 date time format, 
//                     And it should only contain the list of activities to be done on that date.
//                     Each activity should contain the 
//                         -type of the activity which is meal/adventure/visit
//                         -location: The location of the activity
//                         -mapLink: The google map link to the location (escape the url so that it is safe in json)
//                         -time: The time the activity is planned to start. Should be in ISO 8601 date time format.
//                         -duration: The duration the activity would take on an average in hours
//                         -cost: The cost per person for that activity
//                         -description: The description of the activity (limit the length of the description to a maximum of 15 words)
//                         -highlights: The list of key attractions or must experience items during this activity(should not include the activity itself)
                
//                 You must always return valid JSON fenced by a markdown code block. Do not return any additional text and make sure url's and other special characters are escaped properly"
//                 `
//         ],
//         ["human", `I would like to visit ${inputState.destination} from ${inputState.startDate} to ${inputState.endDate}. Can you prepare an itinerary for me?.`],
//     ]);

//     return {
//         itinerary: aiMsg.itinerary
//     }
// }



// const graphBuilder = tripPlannningSystemGraph
//     .addNode('ActivitesExplorer', explorePossibleActivites)
//     .addNode('PlanTrip',planTrip)
//     .addEdge('ActivitesExplorer','PlanTrip')
//     .addEdge('__start__', 'ActivitesExplorer')
//     .addEdge('PlanTrip', '__end__');

// export const tripPlannningSystem = graphBuilder.compile();

// tripPlannningSystem.name = 'Trip Planner'


// const itinerarySchema = z.object({
//     name: z.string().describe("The name of the destination city/country"),
//     itinerary: z.array(
//         z.object({
//             date: z.coerce.date().describe("The date of this itinerary"),
//             activities: z.array(
//                 z.object({
//                     type: z.enum([Type.Adventure, Type.Meal, Type.Visit]).describe("The type of the activity meal/adventure/visit"),
//                     location: z.string().describe("The location of the activity"),
//                     mapLink: z.string().describe("The google map link to the location"),
//                     time: z.coerce.date().describe("The time the activity is planned to start"),
//                     duration: z.number().describe("The duration the activity would take on an average in hours"),
//                     cost: z.number().describe("The cost per person for that activity"),
//                     description: z.string().describe("The description for the activity"),
//                     highlights: z.array(
//                         z.string().describe("The name of the highlight")
//                     ).describe("The must look out for or expereince items during this activity")
//                 }).describe("A single activity")
//             ).describe("The list of activities planned for the day")
//         }).describe("The itinerary of a day during the trip")
//     ).describe("The list of day wise itinerary of the trip")
// });



// var llmwithStructuredOutput = getOllama().withStructuredOutput(todoSchema, { name: 'get_top_todo_activities' });
// var planTripLlm = getOllama().withStructuredOutput(itinerarySchema, { name: 'plan_trip' });


