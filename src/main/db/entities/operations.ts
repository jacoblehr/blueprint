import sqlite from "better-sqlite3";
import { Entity } from "./entity";

export interface ReadOperation {
	id: number;
	image_id: number;
	blueprint_id: number;
	input_data: string;
	output_data: string;
	operation_data: string;
	created_at: string;
	updated_at: string;
};

export interface WriteOperation {
	image_id?: number;
	blueprint_id?: number;
	input_data?: string;
	output_data?: string;
	operation_data?: string;
};

export type Operation = ReadOperation;

class Operations extends Entity<ReadOperation, WriteOperation> {
	
	public initStatement: string = `
		CREATE TABLE IF NOT EXISTS operations (
			id INTEGER PRIMARY KEY,
			image_id INTEGER NOT NULL,
			blueprint_id INTEGER,
			input_data TEXT NOT NULL DEFAULT '{}',
			output_data TEXT NOT NULL DEFAULT '{}',
			operation_data TEXT NOT NULL,
			created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME,
		
			FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
			FOREIGN KEY (blueprint_id) REFERENCES blueprints(id) ON DELETE CASCADE
		);
		
		CREATE TRIGGER IF NOT EXISTS operation_updated
		AFTER UPDATE ON operations
		BEGIN
			UPDATE operations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
		END;
	`;

	public createStatement: string = `
		INSERT INTO operations (image_id, blueprint_id, input_data, output_data, operation_data)
		VALUES (@image_id, @blueprint_id, @input_data, @output_data, @operation_data);
	`;

	public findStatement: string = `
		SELECT *
		FROM operations
		WHERE id = @id;
	`;

	public updateStatement: string = `
		UPDATE operations
		SET
			image_id = @image_id,
			blueprint_id = @blueprint_id,
			input_data = @input_data,
			output_data = @output_data,
			operation_data = @operation_data
		WHERE id = @id;
	`;

	public deleteStatement: string = `
		DELETE
		FROM operations
		WHERE id = @id;
	`;

	public findAllStatement: string = `
		SELECT *
		FROM operations
	`

};

export default Operations;