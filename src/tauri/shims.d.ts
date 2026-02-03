declare module "@tauri-apps/plugin-fs" {
  export function readTextFile(path: string): Promise<string>;
  export function writeTextFile(path: string, contents: string): Promise<void>;
  export function exists(path: string): Promise<boolean>;
  export function mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;
  export function rename(oldPath: string, newPath: string): Promise<void>;
  export function remove(path: string): Promise<void>;
}

declare module "@tauri-apps/api/path" {
  export function appDataDir(): Promise<string>;
  export function join(...paths: string[]): Promise<string> | string;
  export function dirname(path: string): Promise<string> | string;
}
