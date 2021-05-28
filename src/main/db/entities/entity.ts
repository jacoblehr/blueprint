import sqlite from "sqlite3";
export interface Entity {
	init: (db: sqlite.Database) => Promise<void>;
}