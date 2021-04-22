import { ipcRenderer } from "electron";
import { useMutation, UseMutationOptions } from "react-query";
import { FileOperationResult } from "../../../common/types";

export const useOpenImage = (options?: UseMutationOptions<unknown, unknown, FileOperationResult, unknown>) => {
	const openImage = () => {
		return ipcRenderer.invoke("file-open", {
			filters: [
				{ name: "Images", extensions: ["png"] }
			]
		});
	};

	return useMutation<FileOperationResult, unknown, void, unknown>(openImage);
};

type SaveImageArgs = {
	data: string;
};

export const useSaveImage = (options?: UseMutationOptions<unknown, unknown, FileOperationResult, unknown>) => {
	const saveImage = ({ data }: SaveImageArgs) => {
		return ipcRenderer.invoke("file-save", {
			data: data,
			filters: [
				{ name: "Images", extensions: ["png"] }
			]
		});
	};

	return useMutation<FileOperationResult, unknown, SaveImageArgs, unknown>(saveImage);
};

export default {
	useOpenImage,
	useSaveImage
};