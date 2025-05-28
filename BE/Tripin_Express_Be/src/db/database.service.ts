import { DatabaseProvider } from "./models/database.provider";
import { MongoDbProvider } from "./providers/mongodb.provider";
import { PostgreSqlProvider } from "./providers/postgresql.provider";

export const enum DbTypes { "MongoDb" ,"PostgreSql"};

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
            case DbTypes.PostgreSql:
                return new PostgreSqlProvider();
            default:
                throw new Error(`Database ${db} not supported`);
        }
    }
}

export const databaseService = new DatabaseService();