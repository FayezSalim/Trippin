import { ChatOllama } from "@langchain/ollama";

//change to factory for all llm models
export class OllamaFactoryService {

    constructor(){

    }


    getOllama(){
        return new ChatOllama({ model: "llama3.2" , temperature:0});
    }


}

export const ollamaService = new OllamaFactoryService();