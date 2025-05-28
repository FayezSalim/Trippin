import mongoose from "mongoose";
import { SchemaOptions } from "./schema-options";
import { ModelProvider } from "./model.provider";

export interface DatabaseProvider {

    get isConnected(): boolean;

    /**@internal */
    connect: () => Promise<boolean>;
    /**@internal */
    disconnect: () => Promise<void>;

    getModel<T extends object>(modelName: string, schemaOptions: SchemaOptions<T>): Promise<ModelProvider<T>>;
}
