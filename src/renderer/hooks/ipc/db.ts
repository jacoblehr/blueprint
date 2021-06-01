import { ipcRenderer } from "electron";
import { useMutation } from "react-query";
import { IDSchema } from "../../../main/db/entities/entity";
import { WriteBlueprint, Blueprint } from "../../../main/db/entities/blueprints";
import { WriteImage, Image } from "../../..//main/db/entities/images";
import { WriteOperation, Operation } from "../../../main/db/entities/operations";

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

// TODO: Convert this to useQuery
export const useGetBlueprint = (options?: any) => {
	const getBlueprint = (input: IDSchema) => {
		return ipcRenderer.invoke("get-blueprint", {
			...input
		});
	};

	return useMutation<Blueprint, unknown, IDSchema, unknown>(getBlueprint, { ...options });
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

// TODO: Convert this to useQuery
export const useGetBlueprints = (options?: any) => {
	const getBlueprints = (input: Partial<Blueprint>) => {
		return ipcRenderer.invoke("get-blueprints", {
			...input
		});
	};

	return useMutation<Blueprint[], unknown, Partial<Blueprint>, unknown>(getBlueprints, { ...options });
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

// TODO: Convert this to useQuery
export const useGetImage = (options?: any) => {
	const getImage = (input: IDSchema) => {
		return ipcRenderer.invoke("get-image", {
			...input
		});
	};

	return useMutation<Image, unknown, IDSchema, unknown>(getImage, { ...options });
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

// TODO: Convert this to useQuery
export const useGetImages = (options?: any) => {
	const getImages = (input: Partial<Image>) => {
		return ipcRenderer.invoke("get-images", {
			...input
		});
	};

	return useMutation<Image[], unknown, Partial<Image>, unknown>(getImages, { ...options });
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

// TODO: Convert this to useQuery
export const useGetOperation = (options?: any) => {
	const getOperation = (input: IDSchema) => {
		return ipcRenderer.invoke("get-operation", {
			...input
		});
	};

	return useMutation<Operation, unknown, IDSchema, unknown>(getOperation, { ...options });
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

// TODO: Convert this to useQuery
export const useGetOperations = (options?: any) => {
	const getOperations = (input: Partial<Operation>) => {
		return ipcRenderer.invoke("get-operations", {
			...input
		});
	};

	return useMutation<Operation[], unknown, Partial<Operation>, unknown>(getOperations, { ...options });
};