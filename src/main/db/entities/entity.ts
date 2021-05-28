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

export type Entity<T> = {
	init: (db: sqlite.Database) => Promise<void>;

	create?: (args: { db: sqlite.Database } & CreateOperation<T>) => Promise<T>;
	read?: (args: { db: sqlite.Database } & ReadOperation<T>) => Promise<T>;
	update?: (args: { db: sqlite.Database } & UpdateOperation<T>) => Promise<T>;
	delete?: (args: { db: sqlite.Database } & DeleteOperation<T>) => Promise<T>;

	createBulk?: (args: { db: sqlite.Database } & BulkCreateOperation<T>) => Promise<Array<T>>;
	readBulk?: (args: { db: sqlite.Database } & BulkReadOperation<T>) => Promise<Array<T>>;
	updateBulk?: (args: { db: sqlite.Database } & BulkUpdateOperation<T>) => Promise<Array<T>>;
	deleteBulk?: (args: { db: sqlite.Database } & BulkDeleteOperation<T>) => Promise<Array<T>>;
}