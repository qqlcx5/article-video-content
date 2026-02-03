"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFileAtomic = writeFileAtomic;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = require("node:fs");
async function writeFileAtomic(filePath, content) {
    await node_fs_1.promises.mkdir(node_path_1.default.dirname(filePath), { recursive: true });
    const tempPath = `${filePath}.tmp.${process.pid}.${Date.now()}`;
    await node_fs_1.promises.writeFile(tempPath, content, "utf8");
    try {
        await node_fs_1.promises.rename(tempPath, filePath);
        return;
    }
    catch (error) {
        const err = error;
        if (err.code !== "EEXIST" && err.code !== "EPERM" && err.code !== "EBUSY") {
            throw error;
        }
    }
    await node_fs_1.promises.rm(filePath, { force: true });
    await node_fs_1.promises.rename(tempPath, filePath);
}
