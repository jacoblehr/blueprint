import sqlite from "sqlite3";
import Blueprints from "./entities/blueprints";

import Images from "./entities/images";
import Operations from "./entities/operations";

const DB_FILE_NAME = "blueprint.sqlite";

const init = async (): Promise<sqlite.Database> => {
	const database = new sqlite.Database(DB_FILE_NAME);
	return database;
};

const migrate = async (database: sqlite.Database): Promise<void> => {
	await Images.init(database);
	await Operations.init(database);
	await Blueprints.init(database);

	return; 
};

export default { init, migrate };