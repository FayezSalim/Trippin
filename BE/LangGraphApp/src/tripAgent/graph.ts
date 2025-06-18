import { END, StateGraph } from "@langchain/langgraph";
import { TripItinerary, TripPlanningInput, TripPlanningState } from "./state.js";
import { planTripNode } from "./nodes/planTrip.node.js";
import { isItineraryComplete, planExecutorNode } from "./nodes/planExecutor.node.js";
import { planDayNode } from "./nodes/planDay.node.js";

const tripPlannningSystemGraph = new StateGraph({
    stateSchema: TripPlanningState,
    input: TripPlanningInput,
    output: TripItinerary
});

const builder = tripPlannningSystemGraph
    .addNode('plantrip', planTripNode)
    .addNode('executePlan', planExecutorNode)
    .addNode('planDay', planDayNode)
    .addEdge('__start__', 'plantrip')
    .addEdge('plantrip', 'executePlan')
    .addEdge('executePlan', 'planDay')
    .addConditionalEdges('planDay', isItineraryComplete, {
        "true": END,
        "false": "executePlan",
    });


export const tripAgent = builder.compile();

tripAgent.name = 'Trip Agent';