import { SharpOperationKey } from "./types";

export type SharpOptionTypeKey = "string" | "number" | "boolean";
export type SharpOptionType = string | number | boolean | Array<any>;

export type SharpOption = {
	key: string;
	label?: string;
	type: SharpOptionType;
	isRequired?: boolean;
	options?: Array<SharpOptionType>;
	defaultValue?: string | number | boolean | Array<any>;
}

export type SharpOptionKey = 
	| "angle"
	| "background"
	| "fit"
	| "height"
	| "radius"
	| "size"
	| "width";

export type SharpOptionValues = {
	[key in SharpOptionKey]: SharpOptionType; 
}

export const AngleOption = { key: "angle", label: "Angle", type: "number" as SharpOptionType, defaultValue: 90 };
export const BackgroundColorOption = { key: "background", label: "Background Color", type: "string" as SharpOptionType, defaultValue: "#000000" };
export const FitOption = { key: "fit", label: "Fit", type: "string" as SharpOptionType, options: ["cover", "contain", "fill", "inside", "outside"], defaultValue: "cover" };
export const HeightOption = { key: "height", label: "Height", type: "number" as SharpOptionType };
export const RadiusOption = { key: "radius", label: "Radius", type: "number" as SharpOptionType, defaultValue: 5 };
export const SizeOption = { key: "size", label: "Size", type: "number" as SharpOptionType, defaultValue: 3 };
export const WidthOption = { key: "width", label: "Width", type: "number" as SharpOptionType };

export const BlurOptions: Array<SharpOption> = [ RadiusOption ];
export const FlipOptions: Array<SharpOption> = [ ];
export const FlopOptions: Array<SharpOption> = [ ];
export const MedianOptions: Array<SharpOption> = [ SizeOption ];
export const NegateOptions: Array<SharpOption> = [ ];
export const NormaliseOptions: Array<SharpOption> = [ ];
export const ResizeOptions: Array<SharpOption> = [ HeightOption, WidthOption ];
export const RotateOptions: Array<SharpOption> = [ AngleOption, BackgroundColorOption ];
export const SharpenOptions: Array<SharpOption> = [ RadiusOption ];

export const SharpOperationOptions: { [key in SharpOperationKey]: Array<SharpOption> } = {
	"blur": BlurOptions,
	"flip": FlipOptions,
	"flop": FlopOptions,
	"median": MedianOptions,
	"negate": NegateOptions,
	"normalise": NormaliseOptions,
	"resize": ResizeOptions,
	"rotate": RotateOptions,
	"sharpen": SharpenOptions
};