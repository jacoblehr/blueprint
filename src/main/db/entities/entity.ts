import sqlite from "better-sqlite3";
export interface Entity {
	init: (db: sqlite.Database) => Promise<void>;
}