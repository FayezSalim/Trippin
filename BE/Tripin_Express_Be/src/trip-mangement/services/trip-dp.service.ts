import { databaseService, DbTypes } from "../../db/database.service";
import { DatabaseProvider } from "../../db/models/database.provider";
import { ModelProvider } from "../../db/models/model.provider";
import { tripSchemaOptions } from "../models/schemas/trip-schema";
import { Trip } from "../models/trip";

export class TripDbService {
    private dbProvider!: Promise<DatabaseProvider>;

    constructor() {
    }

    public async tripModel(): Promise<ModelProvider<Trip>> {
        const provider = await this.getDbProvider();
        return provider.getModel("Trips", tripSchemaOptions);
    }

    private getDbProvider(): Promise<DatabaseProvider> {
        if (!this.dbProvider) {
            this.dbProvider = databaseService.connect(DbTypes.PostgreSql);
        }

        return this.dbProvider;
    }

}


export const tripDbService = new TripDbService();