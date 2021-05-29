import sqlite from "better-sqlite3";
import Blueprints from "./entities/blueprints";

import Entities from "./entities";

const init = (): sqlite.Database => {
	const database = new sqlite(":memory:");
	return database;
};

const close = async(database: sqlite.Database): Promise<void> => {
	await database.close();
	return;
};

const migrate = async (database: sqlite.Database): Promise<void> => {
	await Entities.images.init(database);
	await Entities.blueprints.init(database);
	await Entities.operations.init(database);

	return; 
};

const save = async(database: sqlite.Database, filename: string): Promise<sqlite.BackupMetadata> => {
	return await database.backup(filename);
};

export default {
	database: init(), 
	close,
	migrate,
	save
};