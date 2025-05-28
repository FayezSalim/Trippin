import { DatabaseProvider } from "../models/database.provider";
import { ModelProvider } from "../models/model.provider";
import { SchemaOptions } from "../models/schema-options";
import { Model, ModelAttributes, Sequelize, ModelAttributeColumnOptions, DataTypes } from 'sequelize';
import { PostgreSqlModelProvider } from "./postgresql-mode.provider";

export class PostgreSqlProvider implements DatabaseProvider {

    private modelProviders: Map<string, PostgreSqlModelProvider<any>>;

    private db: Promise<Sequelize> | undefined;
    private connected: boolean;

    constructor() {
        this.connected = false;
        this.modelProviders = new Map<string, PostgreSqlModelProvider<any>>();
    }

    get isConnected(): boolean {
        return this.connected;
    }

    async connect(): Promise<boolean> {
        //collect from .env
        const seq = new Sequelize('Trippin', 'postgres', 'virux', {
            dialect: 'postgres'
        });

        this.db = seq.sync();
        return true;
    }
    async disconnect(): Promise<void> {
        if (this.db) {
            const seq = await this.db;
            await seq.close();
        }

    }

    async getModel<T extends object>(modelName: string, schemaOptions: SchemaOptions<T>): Promise<ModelProvider<T>> {
        if (!this.db) {
            throw new Error('Db not connected');
        }
        const seq = await this.db;

        if (this.modelProviders.has(modelName)) {
            return this.modelProviders.get(modelName)!;
        }

        const preparedSchema: ModelAttributes<Model<any, any>, T> = {} as any;

        for (var key in schemaOptions.schemaInfo) {

            var info = schemaOptions.schemaInfo[key];
            if (info == undefined) {
                continue;
            }

            preparedSchema[key] = {
                type: this.mapType(info.type),
                allowNull: !this.parseRequired(info.required),
                unique: info.unique,
                defaultValue: info.default,
                //validate to implement validation

            } as ModelAttributeColumnOptions<any>;

        }


        const model = seq.define(modelName, preparedSchema, {
            timestamps: schemaOptions.timestamp
        });
        await seq.sync();
        var createdModel = new PostgreSqlModelProvider(model);
        this.modelProviders.set(modelName, createdModel);
        return createdModel;
    }


    private mapType(type: any) {
        switch (type) {
            case String:
                return DataTypes.STRING;
            case "Float":
                return DataTypes.FLOAT;
            case "Double":
                return DataTypes.DOUBLE;
            case Number:
                return DataTypes.INTEGER;
            case BigInt:
                return DataTypes.BIGINT;
            default:
                return DataTypes.STRING
        }
    }

    private parseRequired(required?: (string | true)[] | boolean): boolean {
        if (!required) {
            return false;
        }

        if (required instanceof Array) {
            return required.length != 0;
            // for (var val of required) {
            //     if (typeof val != "string") {
            //         return val;
            //     }
            // }
        } else {
            return required;
        }

    }

}