import * as React from "react";
import { ImageMetadata } from "../../common/types";



export type Image = {
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
	const [data, setData] = React.useState<Array<Image>>([]);

	const add = (image: Image) => {
		const updatedData = [...data];
		updatedData.push(image);
		setData(updatedData);
	};

	const remove = (key: string) => {
		const updatedData = [...data];
		const removeIndex = updatedData.findIndex((img: Image) => img.key === key);
		updatedData.splice(removeIndex, 1);

		setData(updatedData);
	};

	const update = (key: string, image: Image) => {
		const updatedData = [...data];
		const updateIndex = updatedData.findIndex((img: Image) => img.key === key);
		updatedData[updateIndex] = { ...image };
		
		setData(updatedData);
	};

	return {
		data,
		setData,
		add,
		remove,
		update
	};
};