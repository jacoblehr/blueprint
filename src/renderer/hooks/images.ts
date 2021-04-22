import * as React from "react";

export type Image = {
	key: string;
	file?: string;
	data?: string;
	preview?: string;
	metadata?: { format: string };
};

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