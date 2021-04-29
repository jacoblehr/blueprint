import { ipcRenderer } from "electron";
import { useMutation, UseMutationOptions } from "react-query";
import { SharpOperationOutput } from "../../../common/types";

// TO DO: Type this properly - generics?
type OperationParameters = any;

export const useVipsOperation = (options?: any) => {
	const _operation = (args: OperationParameters) => {
		const { operation } = args;

		return ipcRenderer.invoke("vips-operation", {
			...args,
			operation
		});
	};

	return useMutation<SharpOperationOutput, unknown, OperationParameters, unknown>(_operation, { ...options });
};