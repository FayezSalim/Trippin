import Model, { ModelCtor } from "sequelize/types/model";
import { ModelProvider, StringKeys } from "../models/model.provider";

export class PostgreSqlModelProvider<T extends {}> implements ModelProvider<T> {

    constructor(private model: ModelCtor<Model<T, any>>) {

    }

    async create(data: T): Promise<T> {
        return this.model.create(data) as unknown as T; //TODO fix type
    }

    async findOne(data: Partial<T>, fields?: StringKeys<T>): Promise<T> {
        var result = await this.model.findOne({
            where: data as any, //fix type

        });

        return result as any;
    }

}