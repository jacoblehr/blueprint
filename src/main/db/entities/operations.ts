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

const CREATE_OPERATION_SQL = `
	INSERT INTO operations (image_id, blueprint_id, input_data, output_data, operation_data)
	VALUES (@image_id, @blueprint_id, @input_data, @output_data, @operation_data);
`;

const READ_OPERATION_SQL = `
	SELECT *
	FROM operations
	WHERE id = @id;
`;

const UPDATE_OPERATION_SQL = `
	UPDATE operations
	SET
		image_id = @image_id,
		blueprint_id = @blueprint_id,
		input_data = @input_data,
		output_data = @output_data,
		operation_data = @operation_data
	WHERE id = @id;
`;

const DELETE_OPERATION_SQL = `
	DELETE
	FROM operations
	WHERE id = @id
`;

const Operations: Entity<ReadOperation, WriteOperation> = {
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
	},

	create: async ({ db, input }) => {
		const insertStatement = db.prepare(CREATE_OPERATION_SQL);
		
		const createResponse = await insertStatement.run({...input});

		const selectStatement = db.prepare<{ id: number }>(READ_OPERATION_SQL);
		const operation = await selectStatement.get({ id: Number(createResponse.lastInsertRowid) });
		if(!operation) {
			throw new Error("Failed to create operation");
		}

		return operation as Operation;
	},

	read: async ({ db, id }) => {
		const selectStatement = db.prepare<{ id: number }>(READ_OPERATION_SQL);
		const operation = await selectStatement.get({ id });
		if(!operation) {
			throw new Error(`No operation with id ${id}`);
		}

		return operation as Operation;
	},

	update: async ({ db, id, input }) => {
		const selectStatement = await db.prepare<{ id: number }>(READ_OPERATION_SQL);

		const operation = await selectStatement.get({ id });
		if(!operation) {
			throw new Error(`No operation with id ${id}`);
		}

		const updateStatement = await db.prepare<{ id: number } & WriteOperation>(UPDATE_OPERATION_SQL);

		await updateStatement.run({
			id: id,
			image_id: input.image_id ?? operation.image_id ,
			blueprint_id: input.blueprint_id ?? operation.blueprint_id,
			input_data: input.input_data ?? operation.input_data,
			output_data: input.output_data ?? operation.output_data,
			operation_data: input.operation_data ?? operation.operation_data
		});
		
		const updatedOperation = await selectStatement.get({ id });
		
		return updatedOperation as Operation;
	},

	delete: async ({ db, id }) => {
		const selectStatement = await db.prepare<{ id: number }>(READ_OPERATION_SQL);

		const operation = await selectStatement.get({ id });
		if(!operation) {
			throw new Error(`No operation with id ${id}`);
		}

		const deleteStatement = await db.prepare<{ id: number }>(DELETE_OPERATION_SQL);

		await deleteStatement.run({ id });

		return;
	}

};

export default Operations;