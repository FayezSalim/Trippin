import mongoose from "mongoose";
import { SchemaOptions } from "./schema-options";

export interface DatabaseProvider {

    get isConnected(): boolean;

    /**@internal */
    connect: () => Promise<boolean>;
    /**@internal */
    disconnect: () => Promise<void>;

    getModel<T>(modelName: string, schemaOptions: SchemaOptions<T>): Promise<dbModel<T>>;
}

export type dbModel<T> = mongoose.Model<T>; //make it generic