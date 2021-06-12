import * as React from "react";

import { ImageView } from "./images";
import { Image, ReadImage, WriteImage } from "../../main/db/entities/images";
import { Tab } from "@chakra-ui/tabs";

export type Tab = {
	key: string;
	title?: string;
	file?: string;
	image?: ReadImage;
	preview?: ImageView;
};

export type UseTabsArgs = {
	images: Array<Image>;
	addImage: (image: WriteImage) => void;
	updateImage: (id: number, image: WriteImage) => void;
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
		const image = images.find((img: Image) => img.name === tab.key);
		if(!image) {
			addImage({
				name: tab.key,
				data: tab.image.data,
				metadata: tab.image.metadata
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

		const tabImage = updatedData[index];
		const image: Image = images.find((img: Image) => tabImage.key === img.name);
		
		updatedData[index] = {
			...tab
		};
		setData(updatedData);
		
		if(tab.preview) {
			updateImage(image.id!, {
				name: image.name,
				data: tab.preview?.data ?? null,
				metadata: tab.preview.metadata ? JSON.stringify(tab.preview.metadata) : null,
			});
		}
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