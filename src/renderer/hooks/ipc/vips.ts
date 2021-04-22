import { ipcRenderer } from "electron";
import { useMutation, UseMutationOptions } from "react-query";
import { BlurParameters, SharpenParameters, SharpOperationOutput, SharpOperationParameters } from "../../../common/types";

// TO DO: Type this properly - generics?
type OperationParameters = any;

export const useVipsOperation = (options?: UseMutationOptions<unknown, unknown, OperationParameters, unknown>) => {
	const operation = (args: OperationParameters) => {
		const { operation } = args;

		return ipcRenderer.invoke("vips-operation", {
			...args,
			operation
		});
	};

	return useMutation<SharpOperationOutput, unknown, OperationParameters, unknown>(operation, {
		...options
	});
};