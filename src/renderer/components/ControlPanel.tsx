import * as React from "react";
import { Button, Flex, Heading, Input, InputGroup, Select, Stack, Switch, Text } from "@chakra-ui/react";
import { useAppContext } from "../context/AppContextProvider";
import { SharpOperationOptions, SharpOption, SharpOptionKey, SharpOptionType, SharpOptionValues } from "../../common/options";
import { SharpOperationKey, SharpOperationOutput } from "../../common/types";
import { useVipsOperation } from "../hooks/ipc/vips";
import { ReadImage } from "../../main/db/entities/images";

type OperationOption = {
	key: string;
	label: string;
}

const OPERATIONS: Array<OperationOption> = [
	{
		key: "blur",
		label: "Blur"
	},
	{
		key: "crop",
		label: "Crop"
	},
	{
		key: "flip",
		label: "Flip"
	},
	{
		key: "flop",
		label: "Flop"
	},
	{
		key: "grayscale",
		label: "Grayscale"
	},
	{
		key: "median",
		label: "Median"
	},
	{
		key: "negate",
		label: "Negate"
	},
	{
		key: "normalise",
		label: "Normalise"
	},
	{
		key: "resize",
		label: "Resize"
	},
	{
		key: "rotate",
		label: "Rotate"
	},
	{
		key: "sharpen",
		label: "Sharpen"
	},
];

export const ControlPanel = () => {
	const { operations, tabs, images } = useAppContext();
	const { mutateAsync: vipsOperation, isLoading } = useVipsOperation();
	
	const { operation, options, setOptionValue } = operations;
	const activeOptions = SharpOperationOptions[operations.operation as SharpOperationKey];

	const selectOperation = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const key = event.currentTarget.value;
		operations.setOperation(key);
	};

	const handleOptionChange = ({ operation, option, value }: OptionChangeArgs) => {
		setOptionValue({
			operation,
			value,
			option: option.key as SharpOptionKey,
		});
	}

	const handleVips = async (operation: SharpOperationKey) => {
		const currentTab = tabs.data[tabs.active];
		const image = images.data.find((img: ReadImage) => img.name === currentTab.key);

		const vipsInput = {
			imageID: image.id,
			operation: operation,
			data: currentTab.preview?.data ?? currentTab.image.data, 
			isPreview: true,
			...options[operation]
		};

		const result = await vipsOperation(vipsInput) as SharpOperationOutput;

		const { metadata, preview } = result;

		tabs.update(tabs.active, {
			...currentTab,
			preview: { metadata, data: preview }
		});
	};

	const handleDiscard = () => {
		const currentTab = tabs.data[tabs.active];

		tabs.update(tabs.active, {
			...currentTab,
			preview: null
		});
	}

	const tabInvalid = (tabs.active === -1 || !tabs.data[tabs.active]);

	return (
		<Stack
			flex="1"
			spacing="1rem"
			height="100%"
			borderLeft="1px solid" 
			borderColor="gray.300"
			px="1rem"
			py="1rem"
		>
			<Flex flexDirection="column">
				<Heading mb="0.6rem" size="sm">Transforms</Heading>
				<Select onChange={selectOperation} size="sm" placeholder="Select Transform">
					{
						OPERATIONS.map((op: OperationOption) => {
							return (
								<option 
									key={op.key}
									value={op.key}
								>
									{op.label}
								</option>
							)
						})
					}
				</Select>
			</Flex>
			<Flex flexDirection="column">
				<Heading mb="0.6rem" size="sm">Options</Heading>
				<Stack spacing="1rem" flex="1" flexDirection="column">
					{
						activeOptions?.map((opt: SharpOption, index: number) => {
							return (
								<Option 
									key={`option-${opt.key}`}
									operation={operations.operation as SharpOperationKey}
									option={opt}
									onChange={handleOptionChange}
								/>
							);
						})	
					}
				</Stack>
			</Flex>
			<Flex my="0.5rem" flex={1} alignItems="flex-end" justifyContent="space-between">
				<Button
					flex={1}
					colorScheme="blue"
					mr="0.5rem"
					size="sm"
					isLoading={isLoading}
					isDisabled={tabInvalid || !operations.operation}
					onClick={() => handleVips(operation as SharpOperationKey)}
				>
					Apply
				</Button>
				<Button
					flex={1}
					size="sm"
					isLoading={isLoading}
					isDisabled={tabInvalid || !tabs.data[tabs.active].preview}
					onClick={handleDiscard}
				>
					Discard
				</Button>
			</Flex>
		</Stack>
	)
};

type OptionChangeArgs = {
	operation: SharpOperationKey;
	option: SharpOption;
	value: SharpOptionType;
}

type OptionProps = {
	operation: SharpOperationKey;
	option: SharpOption;
	onChange: ({ operation, option, value }: OptionChangeArgs) => void;
}

const Option = ({ operation, option, onChange }: OptionProps) => {
	const { key, label, type, isRequired, defaultValue } = option;

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.currentTarget.value;
		onChange({ operation, option, value });
		
	};

	const handleNumberInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(event.currentTarget.value);

		onChange({ operation, option, value });
	};

	const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.currentTarget.value;

		onChange({ operation, option, value });
	};

	return (
		<Flex flex={1} id={key} justifyContent="center" alignItems="center">
			<Text flex={1} size="sm" mx="0.5rem"> { label } </Text>
			{
				type === "string" && 
				<InputGroup flex={3}>
					<Input
						defaultValue={defaultValue as string}
						onChange={handleInputChange}
						size="sm"
					/>
				</InputGroup>
			}
			{
				type === "number" && 
				<InputGroup flex={3}>
					<Input
						defaultValue={defaultValue as string}
						onChange={handleNumberInputChange}
						size="sm"
					/>
				</InputGroup>
			}
			{
				type === "boolean" && 
				<InputGroup flex={3}>
					<Switch
						defaultChecked={defaultValue as boolean}
						onChange={handleSwitchChange}
						size="sm"
					/>
				</InputGroup>
			}
		</Flex>
	);
}