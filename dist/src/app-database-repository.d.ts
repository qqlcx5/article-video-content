import type { IAppDatabase } from "./app-database";
export interface IAppDatabaseRepository {
    load(): Promise<IAppDatabase>;
    save(db: IAppDatabase): Promise<void>;
}
export declare class JsonFileAppDatabaseRepository implements IAppDatabaseRepository {
    readonly filePath: string;
    constructor(filePath: string);
    load(): Promise<IAppDatabase>;
    save(db: IAppDatabase): Promise<void>;
}
