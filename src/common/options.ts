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
	| "fit" 
	| "height" 
	| "width" 
	| "radius";

export type SharpOptionValues = {
	[key in SharpOptionKey]: SharpOptionType; 
}

export const FitOption = { key: "fit", label: "Fit", type: "string" as SharpOptionType, options: ["cover", "contain", "fill", "inside", "outside"], defaultValue: "cover" };
export const WidthOption = { key: "width", label: "Width", type: "number" as SharpOptionType };
export const HeightOption = { key: "height", label: "Height", type: "number" as SharpOptionType };
export const RadiusOption = { key: "radius", label: "Radius", type: "number" as SharpOptionType, defaultValue: 5 };

export const ResizeOptions: Array<SharpOption> = [ HeightOption, WidthOption ];
export const BlurOptions: Array<SharpOption> = [ RadiusOption ];
export const SharpenOptions: Array<SharpOption> = [ RadiusOption ];
export const NormaliseOptions: Array<SharpOption> = [ ];

export const SharpOperationOptions: { [key in SharpOperationKey]: Array<SharpOption> } = {
	"resize": ResizeOptions,
	"blur": BlurOptions,
	"sharpen": SharpenOptions,
	"normalise": NormaliseOptions
};