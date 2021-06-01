import { ipcRenderer } from "electron";
import { useMutation } from "react-query";
import { FileOperationResult } from "../../../common/types";

export const useOpenImage = (options?: any) => {
	const openImage = () => {
		return ipcRenderer.invoke("file-open", {
			filters: [
				{ name: "Images", extensions: ["png"] }
			]
		});
	};

	return useMutation<FileOperationResult, unknown, void, unknown>(openImage, { ...options });
};

type SaveImageArgs = {
	data: string;
};

export const useSaveImage = (options?: any) => {
	const saveImage = ({ data }: SaveImageArgs) => {
		return ipcRenderer.invoke("file-save", {
			data: data,
			filters: [
				{ name: "Images", extensions: ["png"] }
			]
		});
	};

	return useMutation<FileOperationResult, unknown, SaveImageArgs, unknown>(saveImage, { ...options });
};

export default {
	useOpenImage,
	useSaveImage
};