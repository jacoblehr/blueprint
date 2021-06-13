import { ipcRenderer } from "electron";
import { useMutation, UseMutationOptions } from "react-query";

type OpenImageResult = {
	canceled: boolean;
	filePaths: Array<string>;
}

export const useOpenImage = (options?: UseMutationOptions<unknown, unknown, OpenImageResult, unknown>) => {
	const openImage = () => {
		return ipcRenderer.invoke("open-file", {
			filters: [
				{ name: "Images", extensions: ["png"] }
			]
		});
	};

	return useMutation<OpenImageResult, unknown, void, unknown>(openImage);
};

export default {
	useOpenImage
};