import * as React from "react";
import { BlurOptions, NormaliseOptions, ResizeOptions, SharpenOptions, SharpOption, SharpOptionKey, SharpOptionType } from "../../common/options";
import { Maybe, SharpOperationKey,  } from "../../common/types";
import { SharpOptionValues } from "../../common/options";

export type Options = {
	[key in SharpOperationKey]: any;
};

type SetOptionValueArgs = {
	operation: SharpOperationKey;
	option: SharpOptionKey;
	value: SharpOptionType;
};

export const useOperations = () => {
	const [operation, setOperation] = React.useState<Maybe<string>>("blur");
	const [options, setOptions] = React.useState<Options>({
		resize: getDefaultOptions(ResizeOptions),
		blur: getDefaultOptions(BlurOptions),
		sharpen: getDefaultOptions(SharpenOptions),
		normalise: getDefaultOptions(NormaliseOptions)
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