import { Image } from "@chakra-ui/image";
import sqlite from "sqlite3";
import { Entity } from "./entity";

interface Image {
	id: number;
	name: string;
	data: string;
	metadata: string;
	created_at: string;
	updated_at: string;
}

const Images: Entity = {
	init: async (db: sqlite.Database): Promise<void> => {
		await db.run(`
			CREATE TABLE IF NOT EXISTS images (
				id INTEGER PRIMARY KEY,
				name TEXT NOT NULL,
				data TEXT NOT NULL,
				metadata TEXT NOT NULL,
				created_at DATETIME NOT NULL,
				updated_at DATETIME NOT NULL
			);
			
			CREATE TRIGGER IF NOT EXISTS image_created
			AFTER INSERT ON images
			BEGIN
				UPDATE images SET created_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
			END;

			CREATE TRIGGER IF NOT EXISTS image_updated
			AFTER UPDATE ON images
			BEGIN
				UPDATE images SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
			END;
		`);

		return;
	}
};

export default Images;