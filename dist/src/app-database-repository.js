"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFileAppDatabaseRepository = void 0;
const node_fs_1 = require("node:fs");
const app_database_1 = require("./app-database");
const write_file_atomic_1 = require("./write-file-atomic");
class JsonFileAppDatabaseRepository {
    filePath;
    constructor(filePath) {
        this.filePath = filePath;
    }
    async load() {
        try {
            const raw = await node_fs_1.promises.readFile(this.filePath, "utf8");
            const parsed = JSON.parse(raw);
            return (0, app_database_1.parseAppDatabaseFromUnknown)(parsed);
        }
        catch (error) {
            const err = error;
            if (err.code === "ENOENT")
                return (0, app_database_1.parseAppDatabaseFromUnknown)(undefined);
            throw error;
        }
    }
    async save(db) {
        const content = (0, app_database_1.serializeAppDatabase)(db);
        await (0, write_file_atomic_1.writeFileAtomic)(this.filePath, content);
    }
}
exports.JsonFileAppDatabaseRepository = JsonFileAppDatabaseRepository;
