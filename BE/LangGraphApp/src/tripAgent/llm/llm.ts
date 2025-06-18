import { ChatOllama } from "@langchain/ollama";

export function getOllama() {
    //return new ChatOllama({ model: "deepseek-r1:14b", temperature: 0 });
    return new ChatOllama({ model: "llama3.2", temperature: 0 });
}