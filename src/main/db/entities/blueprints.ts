import sqlite from "better-sqlite3";
import { Entity } from "./entity";

export interface ReadBlueprint {
	id: number;
	name: string;
	data: string;
	created_at: string;
	updated_at: string;
};

export interface WriteBlueprint {
	name: string;
	data: string;
};

export type Blueprint = ReadBlueprint;

class Blueprints extends Entity<ReadBlueprint, WriteBlueprint> {

	public initStatement: string = `
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
	`;

	public createStatement: string = `
		INSERT INTO blueprints (name, data)
		VALUES (@name, @data);
	`;

	public findStatement: string = `
		SELECT *
		FROM blueprints
		WHERE id = @id;
	`;

	public updateStatement: string = `
		UPDATE blueprints
		SET
			name = @name,
			data = @data
		WHERE id = @id;
	`;
	
	public deleteStatement: string = `
		DELETE
		FROM blueprints
		WHERE id = @id;
	`;

	public findAllStatement: string = `
		SELECT *
		FROM blueprints
	`;

};

export default Blueprints;