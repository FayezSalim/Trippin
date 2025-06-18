import { Annotation, StateGraph } from "@langchain/langgraph";
import z from "zod";

export interface Name {
    firstName?: string;
    lastName?: string;
}

export interface TestState {
    text: string;
    name: Name;
}

const inputAnnotation = Annotation.Root({
    text: Annotation<string>,
    name: Annotation<Name>
});

const nameAnnotation = Annotation<Name>({
    reducer:
        (a, b) => { return { ...a, ...b }; }
});

const stateAnnotation = Annotation.Root({
    text: Annotation<string>,
    name: nameAnnotation,
    intermediateState: Annotation<string>,
    private: Annotation<string[]>
});


const outputAnnotation = Annotation.Root({
    text: Annotation<string>,
    fullName: Annotation<string>
});

const graphBuilder = new StateGraph({
    stateSchema: stateAnnotation,
    input: inputAnnotation,
    output: outputAnnotation
});

// const d = new StateGraph<TestState>({
//     channels: {
//         text: {
//             reducer: (c, u) => { return u; }
//         },
//         name: {
//             reducer: (c, u) => { return u; }
//         },
//         // name: {
//         //     firstName: {
//         //         reducer: (currState, updatedValue) => { return updatedValue; },
//         //         default: () => ""
//         //     }
//         // }
//     }
// });

// const privateState = Annotation.Root({
//     ...stateAnnotation.spec,
//     private: Annotation<string[]>
// });

const myNode = (state: typeof inputAnnotation.State): Partial<typeof stateAnnotation.State> => {
    return {
        text: "first node  " + state.text,
        intermediateState: 'state intermediate',
        private: ['test private']
    };
}

// const nodeToUpdateLastName = (state: typeof stateAnnotation.)

const mySecondNode = (state: typeof stateAnnotation.State) => {
    return {
        text: " second node  " + state.text,
        fullName: `${state.name.firstName} ${state.name.lastName} ${state.intermediateState} ${state.private[0]}`
    };
};

export const graphDiag = graphBuilder.addNode("myNode", myNode)
    .addNode("mySecondNode", mySecondNode)
    .addEdge("myNode", "mySecondNode")
    .addEdge("mySecondNode", "__end__")
    .addEdge("__start__", "myNode");




// const inputSchema = z.object({
//     text: z.string(),
//     name: z.object({
//         firstName: z.string(),
//         lastname: z.string()
//     })
// });

// const outputSchema = z.object({
//     text: z.string(),
//     fullName: z.string()
// });

// const stateSchema = z.object({
//     text: z.string(),
//     name: z.object({
//         firstName: z.string(),
//         lastname: z.string()
//     }),
//     fullName: z.string()
// });


// const myNode = (state: z.infer<typeof inputSchema>): z.infer<typeof stateSchema> => {
//     return {
//         text: 'changed by node1'
//     };
// }

// const mySecondNode = (state: z.infer<typeof stateSchema>): z.infer<typeof stateSchema> => {
//     return {
//         currentOutput: " second node  " + state.currentOutput,
//         name: {
//             lastName: 'salim'
//         }
//     };
// };


// export const graphDiag = graphBuilder.addNode("myNode", myNode)
//     .addNode("mySecondNode", mySecondNode)
//     .addEdge("myNode", "mySecondNode")
//     .addEdge("mySecondNode", "__end__")
//     .addEdge("__start__", "myNode");



export const graph = graphDiag.compile();

graph.name = "Test Agent";