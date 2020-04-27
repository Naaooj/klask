import {join} from "path";

export const ROOT = join(process.cwd());
export const SRC = join(ROOT, 'src');
export const CLIENT = join(SRC, 'client');
export const DIST = join(ROOT, 'dist');
export const ASSETS = join(CLIENT, 'assets');