import * as React from "react";

import { ImageView } from "./images";
import { Image, ReadImage, WriteImage } from "../../main/db/entities/images";

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
		const image = images.find((img: Image) => img.id === tab.image.id);
		if(!image) {
			addImage({
				name: tab.file,
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
		updateImage(target.image.id!, {
			data: JSON.stringify(target.preview.data),
			metadata: JSON.stringify(target.preview.metadata),
		});
	};

	const update = (index: number, tab: Tab) => {
		const updatedData = [...data];

		const oldImage = updatedData[index].image;
		
		updatedData[index] = {
			...tab
		};
		setData(updatedData);
		
		updateImage(oldImage.id, {
			data: JSON.stringify(tab.preview.data),
			metadata: JSON.stringify(tab.preview.metadata),
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