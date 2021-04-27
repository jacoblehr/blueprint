export type GetDataURLArgs = {
	format: string;
	data: string;
}

export const getDataURL = ({ format, data }: GetDataURLArgs) => {
	return `data:image/${format};base64, ${data}`;
}