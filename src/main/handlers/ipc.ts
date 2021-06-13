import { dialog, ipcMain } from "electron";
import { FileOperationArgs } from "../../common/types";
import * as vips from "./vips";

import db from "../db";
import Entities from "../db/entities";

import { Blueprint } from "../db/entities/blueprints";
import { Image } from "../db/entities/images";
import { Operation } from "../db/entities/operations";

export type VipsOperationArgs = {
	file: string;
}

export const registerHandlers = () => {

	/**
	 * File Management
	 */
	ipcMain.handle("file-open", async (event: Electron.IpcMainInvokeEvent, args: Electron.OpenDialogOptions) => {
		const result = await dialog.showOpenDialog({ ...args });
		const { canceled, filePaths } = result;
		if(canceled) {
			return {
				file: null,
				data: null,
				metadata: null
			}
		}

		const data = await vips.open({ file: filePaths[0] });
		const { data: dataBuffer, info } = await data.toBuffer({ resolveWithObject: true });

		return {
			file: filePaths[0] ?? null,
			data: await dataBuffer.toString("base64"),
			metadata: { ...info }
		};
	});

	ipcMain.handle("file-save", async (event: Electron.IpcMainEvent, args: any) => {
		const saveResult: Electron.SaveDialogReturnValue = await dialog.showSaveDialog({ ...args });
		const { canceled, filePath } = saveResult;
		if(canceled) {
			return {
				file: null,
				data: null,
				metadata: null
			}
		}

		const fileSaveArgs = args as FileOperationArgs;
		const { data } = fileSaveArgs;
		const inputBuffer = Buffer.from(data, "base64");
		const input = await vips.init({ buffer: inputBuffer });
		const result = await vips.save({ file: filePath, input });

		const metadata = await input.metadata();
	
		return {
			file: filePath,
			data: await inputBuffer.toString("base64"),
			metadata: metadata	
		};
	});

	/**
	 * VIPS Operations
	 */
	ipcMain.handle("vips-operation", async (event: Electron.IpcMainInvokeEvent, args: any) => {
		const vipsOperationArgs = args as FileOperationArgs;
		const { file, data, imageID } = vipsOperationArgs;

		let input;

		if(file) {
			input = await vips.open({ file: vipsOperationArgs.file });
		}
		else {
			const inputBuffer = Buffer.from(data, "base64");
			input = await vips.init({ buffer: inputBuffer });
		}

		const output = await vips.transform({ 
			input,
			...args
		});


		await Entities.operations.create({
			db: db.database,
			input: {
				image_id: imageID,
				blueprint_id: null,
				input_data: JSON.stringify({ ...input }),
				output_data: JSON.stringify(output),
				operation_data: JSON.stringify({ vipsOperationArgs })
			}
		});

		return output;
	});

	/**
	 * Database Operations
	 */
	
	// Blueprints
	ipcMain.handle("create-blueprint", async (event: Electron.IpcMainInvokeEvent, args: Blueprint) => {
		const { name, data } = args;

		return await Entities.blueprints.create({
			db: db.database,
			input: { name, data }
		});
	});

	ipcMain.handle("get-blueprint", async (event: Electron.IpcMainInvokeEvent, args: { id: number }) => {
		const { id } = args;

		return await Entities.blueprints.find({
			db: db.database,
			id
		});
	});

	ipcMain.handle("update-blueprint", async (event: Electron.IpcMainInvokeEvent, args: Blueprint) => {
		const { id, name, data } = args;

		return await Entities.blueprints.update({
			db: db.database,
			id,
			input: { name, data }
		});
	});

	ipcMain.handle("delete-blueprint", async (event: Electron.IpcMainInvokeEvent, args: { id: number }) => {
		const { id } = args;

		return await Entities.blueprints.delete({
			db: db.database,
			id
		});
	});

	ipcMain.handle("get-blueprints", async (event: Electron.IpcMainInvokeEvent, args: Partial<Blueprint>) => {
		const { id } = args;

		return await Entities.blueprints.findAll({
			db: db.database,
			where: { ...args }
		});
	});

	// Images
	ipcMain.handle("create-image", async (event: Electron.IpcMainInvokeEvent, args: Image) => {
		const { name, data, metadata } = args;

		return await Entities.images.create({
			db: db.database,
			input: { name, data, metadata }
		});
	});

	ipcMain.handle("get-image", async (event: Electron.IpcMainInvokeEvent, args: { id: number }) => {
		const { id } = args;

		return await Entities.images.find({
			db: db.database,
			id
		});
	});

	ipcMain.handle("update-image", async (event: Electron.IpcMainInvokeEvent, args: Image) => {
		const { id, name, data, metadata } = args;

		return await Entities.images.update({
			db: db.database,
			id,
			input: { name, data, metadata }
		});
	});

	ipcMain.handle("delete-image", async (event: Electron.IpcMainInvokeEvent, args: { id: number }) => {
		const { id } = args;

		return await Entities.images.delete({
			db: db.database,
			id
		});
	});

	ipcMain.handle("get-images", async (event: Electron.IpcMainInvokeEvent, args: Partial<Image>) => {
		const { id } = args;

		return await Entities.images.findAll({
			db: db.database,
			where: { ...args }
		});
	});

	// Operations
	ipcMain.handle("create-operation", async (event: Electron.IpcMainInvokeEvent, args: Operation) => {
		const { image_id, blueprint_id, input_data, output_data, operation_data } = args;

		return await Entities.operations.create({
			db: db.database,
			input: { image_id, blueprint_id, input_data, output_data, operation_data }
		});
	});

	ipcMain.handle("get-operation", async (event: Electron.IpcMainInvokeEvent, args: { id: number }) => {
		const { id } = args;

		return await Entities.operations.find({
			db: db.database,
			id
		});
	});

	ipcMain.handle("update-operation", async (event: Electron.IpcMainInvokeEvent, args: Operation) => {
		const { id, image_id, blueprint_id, input_data, output_data, operation_data } = args;

		return await Entities.operations.update({
			db: db.database,
			id,
			input: { image_id, blueprint_id, input_data, output_data, operation_data }
		});
	});

	ipcMain.handle("delete-operation", async (event: Electron.IpcMainInvokeEvent, args: { id: number }) => {
		const { id } = args;

		return await Entities.operations.delete({
			db: db.database,
			id
		});
	});

	ipcMain.handle("get-operations", async (event: Electron.IpcMainInvokeEvent, args: Partial<Operation>) => {
		const { id } = args;

		return await Entities.operations.findAll({
			db: db.database,
			where: { ...args }
		});
	});
}