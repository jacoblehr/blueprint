import { ipcRenderer } from "electron";
import { useMutation, useQuery, QueryKey, QueryFunctionContext } from "react-query";
import { IDSchema } from "../../../main/db/entities/entity";
import { WriteBlueprint, Blueprint } from "../../../main/db/entities/blueprints";
import { WriteImage, Image } from "../../..//main/db/entities/images";
import { WriteOperation, Operation } from "../../../main/db/entities/operations";

export const BLUEPRINTS_KEY = `blueprints`;
export const IMAGES_KEY = `images`;
export const OPERATIONS_KEY = `operations`;

/**
 * Blueprints
 */
export const useCreateBlueprint = (options?: any) => {
	const createBlueprint = (input: WriteBlueprint) => {
		return ipcRenderer.invoke("create-blueprint", {
			...input
		});
	};

	return useMutation<Blueprint, unknown, WriteBlueprint, unknown>(createBlueprint, { ...options });
};

export const useGetBlueprint = (options: { id: number } & any) => {
	const getBlueprint = (input: IDSchema & QueryFunctionContext) => {
		return ipcRenderer.invoke("get-blueprint", {
			...input
		});
	};

	return useQuery<IDSchema, unknown, IDSchema, QueryKey>(`${BLUEPRINTS_KEY}-${options.id}`, getBlueprint, options);
};

export const useUpdateBlueprint = (options?: any) => {
	const updateBlueprint = (input: IDSchema & WriteBlueprint) => {
		return ipcRenderer.invoke("update-blueprint", {
			...input
		});
	};

	return useMutation<Blueprint, unknown, IDSchema & WriteBlueprint, unknown>(updateBlueprint, { ...options });
};

export const useDeleteBlueprint = (options?: any) => {
	const deleteBlueprint = (input: IDSchema) => {
		return ipcRenderer.invoke("delete-blueprint", {
			...input
		});
	};

	return useMutation<Blueprint, unknown, IDSchema, unknown>(deleteBlueprint, { ...options });
};

export const useGetBlueprints = (options?: any) => {
	const getBlueprints = (input: Partial<Blueprint> & QueryFunctionContext) => {
		return ipcRenderer.invoke("get-blueprints", {
			...input
		});
	};

	return useQuery<Blueprint[], unknown, Partial<Blueprint>, QueryKey>(`${BLUEPRINTS_KEY}`, getBlueprints, { ...options });
};

/**
 * Images
 */
 export const useCreateImage = (options?: any) => {
	const createImage = (input: WriteImage) => {
		return ipcRenderer.invoke("create-image", {
			...input
		});
	};

	return useMutation<Image, unknown, WriteImage, unknown>(createImage, { ...options });
};

export const useGetImage = (options: { id: number } & any) => {
	const getImage = (input: IDSchema & QueryFunctionContext) => {
		return ipcRenderer.invoke("get-image", {
			...input
		});
	};

	return useQuery<Image, unknown, IDSchema, QueryKey>(`${IMAGES_KEY}-${options.id}`, getImage, { ...options });
};

export const useUpdateImage = (options?: any) => {
	const updateImage = (input: IDSchema & WriteImage) => {
		return ipcRenderer.invoke("update-image", {
			...input
		});
	};

	return useMutation<Image, unknown, IDSchema & WriteImage, unknown>(updateImage, { ...options });
};

export const useDeleteImage = (options?: any) => {
	const deleteImage = (input: IDSchema) => {
		return ipcRenderer.invoke("delete-image", {
			...input
		});
	};

	return useMutation<Image, unknown, IDSchema, unknown>(deleteImage, { ...options });
};

export const useGetImages = (options?: any) => {
	const getImages = (input: Partial<Image> & QueryFunctionContext) => {
		return ipcRenderer.invoke("get-images", {
			...input
		});
	};

	return useQuery<Image[], unknown, Partial<Image>, QueryKey>(`${IMAGES_KEY}`, getImages, { ...options });
};

/**
 * Operations
 */
 export const useCreateOperation = (options?: any) => {
	const createOperation = (input: WriteOperation) => {
		return ipcRenderer.invoke("create-operation", {
			...input
		});
	};

	return useMutation<Operation, unknown, WriteOperation, unknown>(createOperation, { ...options });
};

export const useGetOperation = (options: { id: number } & any) => {
	const getOperation = (input: IDSchema & QueryFunctionContext) => {
		return ipcRenderer.invoke("get-operation", {
			...input
		});
	};

	return useQuery<Operation, unknown, IDSchema, QueryKey>(`${OPERATIONS_KEY}-${options.id}`, getOperation, { ...options });
};

export const useUpdateOperation = (options?: any) => {
	const updateOperation = (input: IDSchema & WriteOperation) => {
		return ipcRenderer.invoke("update-operation", {
			...input
		});
	};

	return useMutation<Operation, unknown, IDSchema & WriteOperation, unknown>(updateOperation, { ...options });
};

export const useDeleteOperation = (options?: any) => {
	const deleteOperation = (input: IDSchema) => {
		return ipcRenderer.invoke("delete-operation", {
			...input
		});
	};

	return useMutation<Operation, unknown, IDSchema, unknown>(deleteOperation, { ...options });
};

export const useGetOperations = (options?: any) => {
	const getOperations = (input: Partial<Operation> & QueryFunctionContext) => {
		return ipcRenderer.invoke("get-operations", {
			...input
		});
	};

	return useQuery<Operation[], unknown, Partial<Operation>, QueryKey>(`${OPERATIONS_KEY}`, getOperations, { ...options });
};