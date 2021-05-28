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

const CREATE_BLUEPRINT_SQL = `
	INSERT INTO blueprints (name, data)
	VALUES (@name, @data);
`;

const READ_BLUEPRINT_SQL = `
	SELECT *
	FROM blueprints
	WHERE id = @id;
`;

const UPDATE_BLUEPRINT_SQL = `
	UPDATE blueprints
	SET
		name = @name,
		data = @data
	WHERE id = @id;
`;

const DELETE_BLUEPRINT_SQL = `
	DELETE
	FROM blueprints
	WHERE id = @id
`;

const Blueprints: Entity<ReadBlueprint, WriteBlueprint> = {
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
	},

	create: async ({ db, input }) => {
		const insertStatement = db.prepare(CREATE_BLUEPRINT_SQL);
		
		const createResponse = await insertStatement.run({...input});

		const selectStatement = db.prepare<{ id: number }>(READ_BLUEPRINT_SQL);
		const blueprint = await selectStatement.get({ id: Number(createResponse.lastInsertRowid) });
		if(!blueprint) {
			throw new Error("Failed to create blueprint");
		}

		return blueprint as Blueprint;
	},

	read: async ({ db, id }) => {
		const selectStatement = db.prepare<{ id: number }>(READ_BLUEPRINT_SQL);
		const blueprint = await selectStatement.get({ id });
		if(!blueprint) {
			throw new Error(`No blueprint with id ${id}`);
		}

		return blueprint as Blueprint;
	},

	update: async ({ db, id, input }) => {
		const selectStatement = await db.prepare<{ id: number }>(READ_BLUEPRINT_SQL);

		const blueprint = await selectStatement.get({ id });
		if(!blueprint) {
			throw new Error(`No blueprint with id ${id}`);
		}

		const updateStatement = await db.prepare<{ id: number } & WriteBlueprint>(UPDATE_BLUEPRINT_SQL);

		await updateStatement.run({
			id: id,
			name: input.name ?? blueprint.name,
			data: input.data ?? blueprint.data
		});
		
		const updatedBlueprint = await selectStatement.get({ id });
		
		return updatedBlueprint as Blueprint;
	},

	delete: async ({ db, id }) => {
		const selectStatement = await db.prepare<{ id: number }>(READ_BLUEPRINT_SQL);

		const blueprint = await selectStatement.get({ id });
		if(!blueprint) {
			throw new Error(`No blueprint with id ${id}`);
		}

		const deleteStatement = await db.prepare<{ id: number }>(DELETE_BLUEPRINT_SQL);

		await deleteStatement.run({ id });

		return;
	}

};

export default Blueprints;