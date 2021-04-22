import * as React from "react";

import { Image } from "./images";

export type Tab = {
	key: string;
	title?: string;
	file?: string;
	data?: string;
	preview?: string;
	metadata?: { format: string };
};

export type UseTabsArgs = {
	images: Array<Image>;
	addImage: (image: Image) => void;
	updateImage: (key: string, image: Image) => void;
};

export const useTabs = ({ images, addImage, updateImage }: UseTabsArgs) => {
	const [active, setActive] = React.useState<number>(-1);
	const [data, setData] = React.useState<Array<Tab>>(new Array<Tab>());

	const add = (tab: Tab, index?: number) => {
		const tabIndex = data.findIndex((t: Tab) => t.key === tab.key);
		if(tabIndex !== -1) {
			setActive(tabIndex);
			return;
		}

		const updatedData = [...data];
		updatedData.splice(index ?? data.length, 0, tab);
		const image = images.find((img: Image) => img.key === tab.key);
		if(!image) {
			addImage({
				key: tab.key,
				file: tab.file,
				data: tab.data,
				preview: tab.preview,
				metadata: tab.metadata
			});
		}

		setData(updatedData);
		setActive(index ?? data.length);
	};

	const remove = (index: number) => {
		const updatedData = [...data];
		const target = updatedData[index];

		updatedData.splice(index, 1);

		if(active > index) {
			setActive(active - 1);
		}
		else if(index === active) {
			if(index > 0 && (active + 1) > updatedData.length) {
				setActive(active - 1);
			}
			else if (index < 0) {
				setActive(active + 1);
			}
		}

		setData(updatedData);
	};

	const update = (index: number, tab: Tab) => {
		const updatedData = [...data];
		const oldKey = updatedData[index].key;
		
		updatedData[index] = {
			...tab
		};
		setData(updatedData);
		
		updateImage(oldKey, {
			key: tab.key,
			file: tab.file,
			data: tab.data,
			preview: tab.preview,
			metadata: tab.metadata 
		});
	};

	const removeByKey = (key: string) => {
		const tabIndex = data.findIndex((t: Tab) => t.key === key);
		if(tabIndex === -1) {
			return;
		}

		remove(tabIndex);
	}

	return {
		active,
		data,
		setActive,
		setData,
		add,
		remove,
		removeByKey,
		update
	};
};