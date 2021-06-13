import sqlite from "better-sqlite3";
import Entities from "./entities";
export class Database {
	public database: sqlite.Database;

	constructor() {
		this.init();
	}

	public init(): sqlite.Database {
		this.database = new sqlite(":memory:");
		return this.database;
	}

	public async close(): Promise<void> {
		await this.database.close();
		return;
	};

	public async migrate(): Promise<void> {
		await Entities.images.init(this.database);
		await Entities.blueprints.init(this.database);
		await Entities.operations.init(this.database);
	
		return; 
	}

	public async save(filename: string): Promise<sqlite.BackupMetadata> {
		return await this.database.backup(filename);
	}

	public async load(filename: string): Promise<void> {
		const workspace = new sqlite(filename, { fileMustExist: true });

		// @ts-ignore
		const workspaceBuffer = workspace.serialize() as Buffer;
		await workspace.close();
		
		// @ts-ignore
		const newWorkspace = new sqlite(workspaceBuffer);

		await this.database.close();
		this.database = newWorkspace;

		return;
	}

}

export default new Database();