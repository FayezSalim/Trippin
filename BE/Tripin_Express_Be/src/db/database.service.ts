import { DatabaseProvider } from "./models/database.provider";
import { MongoDbProvider } from "./providers/mongo-db.provider";

export const enum DbTypes { "MongoDb" };

export class DatabaseService {
    private connectedDbs: Map<DbTypes, DatabaseProvider>;

    constructor() {
        this.connectedDbs = new Map<DbTypes, DatabaseProvider>();
    }

    public async connect(db: DbTypes): Promise<DatabaseProvider> {
        if (this.connectedDbs.has(db)) {
            return this.connectedDbs.get(db) as DatabaseProvider;
        }

        const dbProvider = this.getDatabaseProvider(db);

        if (!await dbProvider.connect()) {
            throw new Error(`Failed to connect to database ${db}`);
        }

        this.connectedDbs.set(db, dbProvider);
        return dbProvider;
    }

    public async disconnect(db: DbTypes): Promise<void> {
        const dbProvider = this.connectedDbs.get(db);
        dbProvider?.disconnect();
        this.connectedDbs.delete(db);   
    }

    public async disconnectAll(): Promise<void> {
        for (const db of this.connectedDbs.keys()) {
            await this.disconnect(db);
        }
    }

    private getDatabaseProvider(db: DbTypes): DatabaseProvider {
        switch (db) {
            case DbTypes.MongoDb:
                return new MongoDbProvider();
            default:
                throw new Error(`Database ${db} not supported`);
        }
    }
}

export const databaseService = new DatabaseService();