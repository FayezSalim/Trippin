import { databaseService, DbTypes } from "../../db/database.service"
import { DatabaseProvider, dbModel } from "../../db/models/database.provider";
import { User, userSchemaOptions } from "../models/schemas/user.schema";

export class AuthDbService {
    private dbProvider!: Promise<DatabaseProvider>;

    constructor() {
    }

    public async userModel(): Promise<dbModel<User>> {
        const provider = await this.getDbProvider();
        return provider.getModel("Users", userSchemaOptions);
    }

    private getDbProvider(): Promise<DatabaseProvider> {
        if (!this.dbProvider) {
            this.dbProvider = databaseService.connect(DbTypes.MongoDb);
        }

        return this.dbProvider;
    }

}

export const authDbService = new AuthDbService();

