import type { IAppDatabaseRepository } from "../app-database-repository";
export type CreateTauriAppDatabaseRepositoryOptions = {
    fileName?: string;
};
export declare function createTauriAppDatabaseRepository(options?: CreateTauriAppDatabaseRepositoryOptions): Promise<IAppDatabaseRepository>;
