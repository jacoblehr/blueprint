import * as React from "react";
import { 
	useCreateImage, 
	useGetImage, 
	useGetImages, 
	useUpdateImage, 
	useDeleteImage, 
	IMAGES_KEY
} from "../hooks/ipc/db";
import { ImageMetadata } from "../../common/types";

import { Image, WriteImage } from "../../main/db/entities/images";
import { useQueryClient } from "react-query";

export type _Image = {
	key: string;
	file?: string;
	image?: ImageView;
	preview?: ImageView;
};

export type ImageView = {
	data: string;
	metadata: ImageMetadata;
}

export const useImages = () => {
	const { mutate: addImage } = useCreateImage();
	const [imageData, setImageData] = React.useState<Array<Image>>([]);
	const { data } = useGetImages({
		onSuccess: (data: Array<Image>) => {
			console.warn("get images", data);
			setImageData(data);
		}
	});
	const { mutate: updateImage } = useUpdateImage();
	const { mutate: deleteImage } = useDeleteImage();

	const queryClient = useQueryClient();

	const add = (image: WriteImage) => {
		addImage({ ...image }, {
			onSuccess: () => {
				queryClient.invalidateQueries(IMAGES_KEY);
			},
			onError: (e) => {
				console.warn(`An error has occurred: ${e}`)
			}
		});
	};

	const remove = (id: number) => {
		deleteImage({ id }, {
			onSuccess: () => {
				queryClient.invalidateQueries(IMAGES_KEY);
			},
			onError: (e) => {
				console.warn(`An error has occurred: ${e}`)
			}
		});
	};

	const update = (id: number, input: WriteImage) => {
		updateImage({ id, ...input }, {
			onSuccess: () => {
				queryClient.invalidateQueries(IMAGES_KEY);
			},
			onError: (e) => {
				console.warn(`An error has occurred: ${e}`)
			}
		})
	};

	return {
		data: imageData,
		add,
		remove,
		update
	};
};