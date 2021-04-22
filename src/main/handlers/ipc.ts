import { dialog, ipcMain } from "electron";
import { Maybe, FileOperationArgs, FileOperationResult } from "../../common/types";
import * as vips from "./vips";

export type VipsOperationArgs = {
	file: string;
}

export const registerHandlers = () => {

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

	ipcMain.handle("vips-operation", async (event: Electron.IpcMainInvokeEvent, args: any) => {
		const vipsOperationArgs = args as FileOperationArgs;
		const { file, data } = vipsOperationArgs;

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

		return output;
	});
}