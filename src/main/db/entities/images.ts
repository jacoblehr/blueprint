import sqlite from "better-sqlite3";
import { Entity } from "./entity";
export interface ReadImage {
	id: number;
	name: string;
	data: string;
	metadata: string;
	created_at: string;
	updated_at: string;
};

export interface WriteImage {
	name?: string;
	data?: string;
	metadata?: string;
};

export type Image = ReadImage;

const Images: Entity<ReadImage, WriteImage> = {
	init: async (db: sqlite.Database) => {
		await db.exec(`
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
	},

	create: async ({ db, input }) => {
		const insertStatement = db.prepare(`
			INSERT INTO images (name, data, metadata)
			VALUES (@name, @data, @metadata)
		`);
		
		const createResponse = await insertStatement.run({...input});

		const selectStatement = db.prepare<{ id: number }>(`
			SELECT *
			FROM images
			WHERE id = @id
		`);

		const [image] = await selectStatement.get({ id: Number(createResponse.lastInsertRowid) });
		if(!image) {
			throw new Error("Failed to create image");
		}

		return image as Image;
	},

	read: async ({ db, id }) => {
		const selectStatement = db.prepare<{ id: number }>(`
			SELECT *
			FROM images
			WHERE id = @id
		`);

		const [image] = await selectStatement.get({ id });
		if(!image) {
			throw new Error(`No image with id ${id}`);
		}

		return image as Image;
	},

	update: async ({ db, id, input }) => {
		const selectStatement = await db.prepare<{ id: number }>(`
			SELECT *
			FROM images
			WHERE id = @id
		`);

		const [image] = await selectStatement.get({ id: id });
		if(!image) {
			throw new Error(`No image with id ${id}`);
		}

		const updateStatement = await db.prepare(`
			UPDATE images
			SET name = 
		`);
		
	}
	
};

export default Images;