import * as React from "react";
import { 
	BlurOptions,
	CropOptions,
	FlipOptions,
	FlopOptions,
	GrayscaleOptions,
	MedianOptions,
	NegateOptions,
	NormaliseOptions,
	ResizeOptions,
	RotateOptions,
	SharpenOptions,
	SharpOption,
	SharpOptionKey,
	SharpOptionType 
} from "../../common/options";
import { Maybe, SharpOperationKey,  } from "../../common/types";

export type Options = {
	[key in SharpOperationKey]: any;
};

type SetOptionValueArgs = {
	operation: SharpOperationKey;
	option: SharpOptionKey;
	value: SharpOptionType;
};

export const useOperations = () => {
	const [operation, setOperation] = React.useState<Maybe<string>>(null);
	const [options, setOptions] = React.useState<Options>({
		blur: getDefaultOptions(BlurOptions),
		crop: getDefaultOptions(CropOptions),
		flip: getDefaultOptions(FlipOptions),
		flop: getDefaultOptions(FlopOptions),
		grayscale: getDefaultOptions(GrayscaleOptions),
		median: getDefaultOptions(MedianOptions),
		negate: getDefaultOptions(NegateOptions),
		normalise: getDefaultOptions(NormaliseOptions),
		resize: getDefaultOptions(ResizeOptions),
		rotate: getDefaultOptions(RotateOptions),
		sharpen: getDefaultOptions(SharpenOptions)
	});

	const setOptionValue = ({ operation, option, value }: SetOptionValueArgs) => {
		const optionValues = { ...options };
		optionValues[operation][option] = value;
		setOptions(optionValues);
	}

	return {
		options,
		operation,
		setOperation,
		setOptions,
		setOptionValue
	};
};

const getDefaultOptions = (options: Array<SharpOption>) => {
	const optionsMap: any = { };
	options.map((value: SharpOption) => {
		optionsMap[value.key] = value.defaultValue!;
	});

	return optionsMap;
};