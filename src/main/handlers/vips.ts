const sharp = require("sharp");

import { 
	BlurParameters, 
	Maybe, 
	ResizeParameters, 
	Sharp, 
	SharpenParameters,
	SharpOperationParameters, 
} from "../../common/types";

export const getSigma = (radius: number) => {
	if(!radius) {
		return null;
	}

	return 1 + (radius / 2);
}

export type FileParameters = {
	file: string;
	input?: Sharp;
};

export type InitSharpParameters = { buffer: Buffer }

export const init = async ({ buffer }: InitSharpParameters) => {
	const handle = await sharp(buffer);
	return handle;
}

export const open = async ({ file }: FileParameters) => {
	const handle = await sharp(file);
	return handle;
}

export const save = async ({ input, file }: FileParameters) => {
	return await input.toFile(file);
}

type TransformResult = {
	raw: Buffer;
	file: Maybe<string>;
	preview: Maybe<string>;
	format: any;	
}

export const transform = async (parameters: SharpOperationParameters): Promise<TransformResult> => {
	const { input, isPreview = true, operation, output, ...rest } = parameters;

	let result = null;
	switch(operation) {
		case "blur":
			const blurParams = parameters as BlurParameters;

			result = await input.blur(getSigma(blurParams.radius));
			break;
		case "sharpen":
			const sharpenParams = parameters as SharpenParameters;
			const { flat, jagged } = sharpenParams;

			result = await input.sharpen(getSigma(sharpenParams.radius), flat, jagged);
			break;
		case "resize":
			const resizeParams = parameters as ResizeParameters;
			result = await input.resize(resizeParams.options);
			break;
		case "normalise":
			result = await input.normalise();
			break;
		default:
			result = await input[operation]({...rest});
			break;
	}

	const metadata = await input.metadata();
	const buffer = await result.toBuffer();

	const transformOutput: TransformResult = { 
		raw: buffer, 
		file: null, 
		preview: null, 
		format: metadata.format 
	};

	if(isPreview) {
		const preview = await buffer.toString("base64");
		transformOutput.preview = preview;
	}
	if (output?.file) {
		const file = result.toFile(output.file);
		transformOutput.file = file;
	}

	result = parameters;

	
	return transformOutput;
}