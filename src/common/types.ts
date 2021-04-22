export type Sharp = any;

export const SharpOperation = {
	"resize": "resize",
	"blur": "blur",
	"sharpen": "sharpen",
	"normalise": "normalise"
}

export type SharpOperationKey = keyof typeof SharpOperation;

export type SharpOperationParameters = {
	operation: SharpOperationKey;
	input: Sharp;
	output?: {
		file: string;
	};
	isPreview: boolean;
}

export type SharpFit = "cover" | "contain" | "fill" | "inside" | "outside";

export type SharpPosition = "top" | "right top" | "right" | "right bottom" | "bottom" | "left bottom" | "left" | "left top";

export type SharpGravity = "north" | "northeast" | "east" | "southeast" | "south" | "southwest" | "west" | "northwest" | "center" | "centre";

export type SharpStrategy = "entropy" | "attention";

export type ResizeParameters = SharpOperationParameters & {
	options?: {
		width?: number;
		height?: number;
		fit?: SharpFit;
		position?: SharpPosition;
		gravity?: SharpGravity;
		strategy?: SharpStrategy;
	}
}

export type BlurParameters = SharpOperationParameters & {
	radius?: number;
}

export type SharpenParameters = SharpOperationParameters & {
	radius?: number;
	flat?: number;
	jagged?: number;
}

export type NormaliseParameters = SharpOperationParameters;

export type SharpOperationOutput = {
	file?: string;
	preview?: string;
	raw?: Sharp;
	format: string;
}

export type Maybe<T> = T | null;

export type FileMetaData = {
	format: string;
}

export type FileOperationArgs = {
	file: string;
	data?: string;
}

export type FileOperationResult = {
	file: Maybe<string>;
	data: string;
	metadata?: FileMetaData
}