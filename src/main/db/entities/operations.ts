import sqlite from "better-sqlite3";
import { Entity } from "./entity";

export interface Operation {
	id?: number;
	image_id?: number;
	blueprint_id?: number;
	input_data?: string;
	output_data?: string;
	operation_data?: string;
	created_at?: string;
	updated_at?: string;
}

const Operations: Entity<Operation> = {
	init: async (db: sqlite.Database): Promise<void> => {
		await db.exec(`
			CREATE TABLE IF NOT EXISTS operations (
				id INTEGER PRIMARY KEY,
				image_id INTEGER NOT NULL,
				blueprint_id INTEGER,
				input_data TEXT NOT NULL,
				output_data TEXT NOT NULL,
				operation_data TEXT NOT NULL,
				created_at DATETIME NOT NULL,
				updated_at DATETIME NOT NULL,
			
				FOREIGN KEY (image_id) REFERENCES images(id),
				FOREIGN KEY (blueprint_id) REFERENCES blueprints(id)
			);

			CREATE TRIGGER IF NOT EXISTS operation_created
			AFTER INSERT ON operations
			BEGIN
				UPDATE operations SET created_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
			END;
			
			CREATE TRIGGER IF NOT EXISTS operation_updated
			AFTER UPDATE ON operations
			BEGIN
				UPDATE operations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
			END;
		`);

		return;
	}
};

export default Operations;