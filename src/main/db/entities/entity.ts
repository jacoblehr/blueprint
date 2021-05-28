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

export type Entity<ReadSchema, WriteSchema> = {
	init: (db: sqlite.Database) => Promise<void>;

	create: (args: { db: sqlite.Database } & CreateOperation<WriteSchema>) => Promise<ReadSchema>;
	read: (args: { db: sqlite.Database } & ReadOperation<IDSchema>) => Promise<ReadSchema>;
	update: (args: { db: sqlite.Database } & UpdateOperation<WriteSchema>) => Promise<ReadSchema>;
	delete: (args: { db: sqlite.Database } & DeleteOperation<IDSchema>) => Promise<void>;

	createBulk?: (args: { db: sqlite.Database } & BulkCreateOperation<WriteSchema>) => Promise<Array<ReadSchema>>;
	readBulk?: (args: { db: sqlite.Database } & BulkReadOperation<IDSchema>) => Promise<Array<ReadSchema>>;
	updateBulk?: (args: { db: sqlite.Database } & BulkUpdateOperation<WriteSchema>) => Promise<Array<ReadSchema>>;
	deleteBulk?: (args: { db: sqlite.Database } & BulkDeleteOperation<IDSchema>) => Promise<Array<ReadSchema>>;
}