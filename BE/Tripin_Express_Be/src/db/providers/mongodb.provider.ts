import mongoose, { model, Schema } from "mongoose";
import { SchemaOptions } from "../models/schema-options";
import { DatabaseProvider } from "../models/database.provider";
import { ModelProvider } from "../models/model.provider";
import { MongodbModelProvider } from "./mongodb-model.provider";

export class MongoDbProvider implements DatabaseProvider {

    private connectionPromise: Promise<boolean> | null | undefined;
    private connected: boolean = false;

    private modelProviders: Map<string, MongodbModelProvider<any>>;

    constructor() {
        this.modelProviders = new Map<string, MongodbModelProvider<any>>();
    }

    public get isConnected(): boolean {
        return this.connected;
    }

    public async connect(): Promise<boolean> {
        console.log(`MongoDbProvider.connect ${process.env.MONGODB_URI} ${process.env.NODE_ENV} ${process.env.AUTH_SECRET}`);
        if (this.connectionPromise) {
            return this.connectionPromise;
        }
        try {
            this.connectionPromise = mongoose.connect(process.env.MONGODB_URI as string, { dbName: 'TrippinDb' }).then(({ connection }) => {
                if (connection.readyState === 1) {
                    this.connected = true;
                    console.log(`MongoDbProvider connected ${connection.host} ${connection.port}`);
                } else {
                    console.warn(`connection.readyState ${connection.readyState}`);
                }
                return this.connected;
            });

            await this.connectionPromise;

        } catch (error) {
            console.error(error);
            throw error;
        }
        return this.connected;
    };

    public async disconnect(): Promise<void> {
        try {
            await mongoose.connection.close();
            this.connectionPromise = null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getModel<T>(modelName: string, schemaOptions: SchemaOptions<T>): Promise<ModelProvider<T>> {
        await this.checkConnection();

        if (this.modelProviders.has(modelName)) {
            return this.modelProviders.get(modelName)!;
        }

        const newModel = new Schema<T>(schemaOptions.schemaInfo as any, { timeStamp: schemaOptions.timestamp }); //correct any type

        this.modelProviders.set(modelName, new MongodbModelProvider<T>(model<T>(modelName, newModel))); //cache the model provider 

        return this.modelProviders.get(modelName)!;
    }

    private async checkConnection(): Promise<void> {
        if (this.connectionPromise) {
            await this.connectionPromise;
            if (!this.connected) {
                throw new Error("MongoDbProvider not connected");
            }
        } else {
            throw new Error("MongoDbProvider not connected");
        }
    }
}

