import Model, { ModelCtor } from "sequelize/types/model";
import { ModelProvider, StringKeys } from "../models/model.provider";

export class PostgreSqlModelProvider<T extends {}> implements ModelProvider<T> {

    constructor(private model: ModelCtor<Model<T, any>>) {

    }

    async create(data: T): Promise<void> {
        await this.model.create(data);
    }

    async findOne(data: Partial<T>, fields?: StringKeys<T>): Promise<T> {
        var result = await this.model.findOne({
            where: data as any, //fix type

        });

        return result as any;
    }

}