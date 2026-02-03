"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFileVideoRepository = void 0;
const node_fs_1 = require("node:fs");
const local_db_1 = require("./local-db");
const write_file_atomic_1 = require("./write-file-atomic");
class JsonFileVideoRepository {
    filePath;
    constructor(filePath) {
        this.filePath = filePath;
    }
    async load() {
        try {
            const raw = await node_fs_1.promises.readFile(this.filePath, "utf8");
            const parsed = JSON.parse(raw);
            return (0, local_db_1.parseLocalVideosFromUnknown)(parsed);
        }
        catch (error) {
            const err = error;
            if (err.code === "ENOENT")
                return [];
            throw error;
        }
    }
    async save(videos) {
        const content = (0, local_db_1.serializeLocalVideos)(videos);
        await (0, write_file_atomic_1.writeFileAtomic)(this.filePath, content);
    }
}
exports.JsonFileVideoRepository = JsonFileVideoRepository;
