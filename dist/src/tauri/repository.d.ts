import type { IVideoRepository } from "../repository";
export type CreateTauriVideoRepositoryOptions = {
    fileName?: string;
};
export declare function createTauriVideoRepository(options?: CreateTauriVideoRepositoryOptions): Promise<IVideoRepository>;
