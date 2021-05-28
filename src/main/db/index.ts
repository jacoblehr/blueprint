import sqlite from "better-sqlite3";
import Blueprints from "./entities/blueprints";

import Images from "./entities/images";
import Operations from "./entities/operations";

const init = async (): Promise<sqlite.Database> => {
	const database = new sqlite(":memory:");
	return database;
};

const close = async(database: sqlite.Database): Promise<void> => {
	await database.close();
	return;
};

const migrate = async (database: sqlite.Database): Promise<void> => {
	await Images.init(database);
	await Operations.init(database);
	await Blueprints.init(database);

	return; 
};

const save = async(database: sqlite.Database, filename: string): Promise<sqlite.BackupMetadata> => {
	return await database.backup(filename);
};

export default { 
	init,
	close,
	migrate,
	save
};