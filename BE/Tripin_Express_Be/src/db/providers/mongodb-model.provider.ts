import { ModelProvider, StringKeys } from "../models/model.provider";
import mongoose from "mongoose";

export class MongodbModelProvider<T> implements ModelProvider<T> {

    constructor(private model: mongoose.Model<T>) {

    }

    async create(data: T): Promise<T> {
        return this.model.create(data);
    }

    async findOne(data: Partial<T>, fields?: StringKeys<T>): Promise<T> {
        const foundData = this.model.findOne(data);
        if (fields) {
            return foundData.select(fields.map((field) => `+${field}`)) as any; //TODO fix typing
        }
        return foundData as any;
    }

}