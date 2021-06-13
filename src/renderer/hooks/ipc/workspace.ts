import { ipcRenderer } from "electron";
import { useMutation } from "react-query";
import { SharpOperationOutput } from "../../../common/types";

export const useSaveWorkspace = (options?: any) => {
	const saveWorkspace = () => {
		return ipcRenderer.invoke("save-workspace", {});
	};

	return useMutation<SharpOperationOutput, unknown, unknown, unknown>(saveWorkspace, { ...options });
};

export const useOpenWorkspace = (options?: any) => {
	const openWorkspace = () => {
		return ipcRenderer.invoke("open-workspace", {});
	};

	return useMutation<SharpOperationOutput, unknown, unknown, unknown>(openWorkspace, { ...options });
};