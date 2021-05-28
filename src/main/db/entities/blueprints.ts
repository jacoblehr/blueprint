import sqlite from "better-sqlite3";
import { Entity } from "./entity";

export interface Blueprint {
	id?: number;
	name?: string;
	data?: string;
	created_at?: string;
	updated_at?: string;
}

const Blueprints: Entity<Blueprint> = {
	init: async (db: sqlite.Database): Promise<void> => {
		await db.exec(`
			CREATE TABLE IF NOT EXISTS blueprints (
				id INTEGER PRIMARY KEY,
				name TEXT NOT NULL,
				data TEXT NOT NULL,
				created_at DATETIME NOT NULL,
				updated_at DATETIME NOT NULL
			);

			CREATE TRIGGER IF NOT EXISTS blueprint_created
			AFTER INSERT ON blueprints
			BEGIN
				UPDATE blueprints SET created_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
			END;
			
			CREATE TRIGGER IF NOT EXISTS blueprint_updated
			AFTER UPDATE ON blueprints
			BEGIN
				UPDATE blueprints SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
			END;
		
		`);

		return;
	}
};

export default Blueprints;