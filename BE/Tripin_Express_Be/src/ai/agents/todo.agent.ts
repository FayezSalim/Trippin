import { ChatOllama } from "@langchain/ollama";
import z from "zod";
import { Runnable } from "@langchain/core/runnables";
import { ollamaService } from "../llm/ollama.service";


export class ToDoAgent {

    private llm!: Runnable<any, any>;

    constructor() {
        this.init();
    }

    private async init() {

        this.llm = ollamaService.getOllama().withStructuredOutput(todoSchema, { name: 'get_top_todo_activities' });


    }

    public async getActivitiesTodo(place: string, startDate: Date, endDate: Date): Promise<ToDo[]> {

        const aiMsg = await this.llm.invoke([
            [
                "system",
                `Act as travel assistant that suggests the most popular things to do when on a trip to a specific city or country.
                You have to consider the time of the year and the duration each activity takes when suggesting them.
                Summarize the things to do into tags that can be displayed on a web application                
                
                Tag Constraints:
                Provide the top 20 suggestions.
                Each activity's name can have a maximum of upto three words with a maximum length of 10 characters.
                Provide an emoji associated with that activity that can be shown as an icon. 
                `
            ],
            ["human", `I would like to visit ${place} from ${startDate} to ${endDate}. Can you suggest me what all activities can I do.`],
        ]);
    
        //output verification and parsing 
        //https://medium.com/@docherty/mastering-structured-output-in-llms-choosing-the-right-model-for-json-output-with-langchain-be29fb6f6675
        return aiMsg;
    }

}



// const todoSchema = z.array(z.object({
//     name: z.string().describe("The activity that can be done in the city/country"),
//     icon: z.string().describe("A unicode icon associated with the activity, which can be displayed in a web application"),
// }));

// const todoSchema = z.object({
//     name: z.string().describe("The name of the city/country"),
//     activities: z.array(z.object({
//         activityName: z.string().describe("The name of the activity"),
//         activityIcon: z.string().describe("The relevant unicode icon that can represent this activity")
//     })).describe("The activities that can be done in the city/country")
// });

const todoSchema = z.object({
    name: z.string().describe("The name of the city/country"),
    activities: z.array(z.object({
        name: z.string().describe("The name of the activity, should contain only two words and a maximum of 15 characters"),
        icon: z.string().describe("The relevant emoji that can represent this activity")
    })).describe("The activities that can be done in the city/country")
});


type ToDo = z.infer<typeof todoSchema>;

export const todoAgent = new ToDoAgent();
