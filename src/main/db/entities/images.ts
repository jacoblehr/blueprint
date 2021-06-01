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

class Images extends Entity<ReadImage, WriteImage> {

	public initStatement: string = `
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
	`

	public createStatement: string = `
		INSERT INTO images (name, data, metadata)
		VALUES (@name, @data, @metadata);
	`;

	public findStatement: string = `
		SELECT *
		FROM images
		WHERE id = @id;
	`;

	public updateStatement: string = `
		UPDATE images
		SET
			name = @name,
			data = @data,
			metadata = @metadata
		WHERE id = @id;
	`;

	public deleteStatement: string = `
		DELETE
		FROM images
		WHERE id = @id;
	`;

	public findAllStatement: string = `
		SELECT *
		FROM images
	`;
};

export default Images;