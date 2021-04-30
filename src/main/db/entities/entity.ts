import sqlite from "sqlite3";

export interface Entity {
	init: (db: sqlite.Database) => void;
}