import { schemaInfo } from "./schema-info";

export interface SchemaOptions<T> {
    schemaInfo: schemaInfo<T>;
    timestamp?: boolean;
    createdAt?: string,
    updatedAt?: string,
}
