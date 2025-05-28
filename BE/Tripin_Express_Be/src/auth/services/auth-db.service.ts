import { databaseService, DbTypes } from "../../db/database.service"
import { DatabaseProvider } from "../../db/models/database.provider";
import { ModelProvider } from "../../db/models/model.provider";
import { User, userSchemaOptions } from "../models/schemas/user.schema";

export class AuthDbService {
    private dbProvider!: Promise<DatabaseProvider>;

    constructor() {
    }

    public async userModel(): Promise<ModelProvider<User>> {
        const provider = await this.getDbProvider();
        return provider.getModel("Users", userSchemaOptions);
    }

    private getDbProvider(): Promise<DatabaseProvider> {
        if (!this.dbProvider) {
            this.dbProvider = databaseService.connect(DbTypes.PostgreSql);
        }

        return this.dbProvider;
    }

}

export const authDbService = new AuthDbService();

