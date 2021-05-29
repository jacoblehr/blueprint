import sqlite from "better-sqlite3";

export type CreateOperation<T> = {
	input: Omit<T, "id">;
};

export type ReadOperation<T> = {
	id: number;
};

export type UpdateOperation<T> = {
	id: number;
	input: Omit<T, "id">;
};

export type DeleteOperation<T> = {
	id: number;
};

export type BulkCreateOperation<T> = {
	input: Array<Omit<T, "id">>;
};

export type BulkReadOperation<T> = {
	where?: {
		[key: string]: keyof T;
	}
};

export type BulkUpdateOperation<T> = {
	where?: {
		[key: string]: keyof T;
	};
	input: Partial<T>;
};

export type BulkDeleteOperation<T> = {
	where?: {
		[key: string]: keyof T;
	};
};

export type IDSchema = {
	id: number;
};

export abstract class Entity<ReadSchema, WriteSchema> {

	public abstract initStatement: string;
	public abstract createStatement: string;
	public abstract findStatement: string;
	public abstract updateStatement: string;
	public abstract deleteStatement: string;

	public async init (db: sqlite.Database): Promise<void> {
		await db.exec(this.initStatement);
	}

	public async create(args: { db: sqlite.Database } & CreateOperation<WriteSchema>): Promise<ReadSchema> {
		const { db, input } = args;

		// Create the entity
		const insertStatement = db.prepare(this.initStatement);
		const createResponse = await insertStatement.run({ ...input })
		
		// Re-read the object
		try {
			const entity = await this.find({ db, id: Number(createResponse.lastInsertRowid) });
			return entity as ReadSchema;
		}
		catch(e) {
			throw new Error(`Failed to create entity`);
		}
	}

	public async find(args: { db: sqlite.Database } & ReadOperation<IDSchema>): Promise<ReadSchema> {
		const { db, id} = args;

		// Find the entity
		const selectStatement = db.prepare<{ id: number }>(this.findStatement);
		const entity = await selectStatement.get({ id });
		if(!entity) {
			throw new Error(`Failed to find entity with id ${id}`);
		}

		return entity as ReadSchema;
	}

	public async update(args: { db: sqlite.Database } & UpdateOperation<WriteSchema>): Promise<ReadSchema> {
		const { db, id, input } = args;

		// Ensure that the entity exists
		await this.find({ db, id });
		
		// Update the entity
		const updateStatement = await db.prepare<{ id: number } & WriteSchema>(this.updateStatement);
		await updateStatement.run({ id, ...input });

		// Re-read the entity
		const updatedEntity = await this.find({ db, id });
		return updatedEntity as ReadSchema;
	}

	public async delete(args: { db: sqlite.Database } & DeleteOperation<IDSchema>): Promise<void> {
		const { db, id } = args;

		// Ensure that the entity exists
		await this.find({ db, id });

		// Delete the entity
		const deleteStatement = await db.prepare<{ id: number }>(this.deleteStatement);
		await deleteStatement.run({ id });
	}

	// createBulk?: (args: { db: sqlite.Database } & BulkCreateOperation<WriteSchema>) => Promise<Array<ReadSchema>>;
	// readBulk?: (args: { db: sqlite.Database } & BulkReadOperation<IDSchema>) => Promise<Array<ReadSchema>>;
	// updateBulk?: (args: { db: sqlite.Database } & BulkUpdateOperation<WriteSchema>) => Promise<Array<ReadSchema>>;
	// deleteBulk?: (args: { db: sqlite.Database } & BulkDeleteOperation<IDSchema>) => Promise<Array<ReadSchema>>;
}