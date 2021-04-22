import * as React from "react";
import { Button, Flex, Heading, Input, InputGroup, Select, Switch, Text } from "@chakra-ui/react";
import { useAppContext } from "../context/AppContextProvider";
import { SharpOperationOptions, SharpOption, SharpOptionKey, SharpOptionType, SharpOptionValues } from "../../common/options";
import { SharpOperationKey, SharpOperationOutput } from "../../common/types";
import { useVipsOperation } from "../hooks/ipc/vips";

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
		key: "sharpen",
		label: "Sharpen"
	},
	{
		key: "normalise",
		label: "Normalise"
	},
	{
		key: "resize",
		label: "Resize"
	}
];

export const ControlPanel = () => {
	const { operations, tabs } = useAppContext();
	const { mutateAsync: vipsOperation } = useVipsOperation();
	
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

		const vipsInput = {
			operation: operation,
			data: currentTab.preview ?? currentTab.data, 
			isPreview: true,
			...options[operation]
		};

		console.warn(vipsInput)

		const result = await vipsOperation(vipsInput) as SharpOperationOutput;

		const { preview } = result;

		tabs.update(tabs.active, {
			...currentTab,
			preview
		});
	};

	const actionsDisabled = tabs.active === -1 || !tabs.data[tabs.active];

	return (
		<Flex my="1rem" mx="1rem">
			<Flex flex="1" flexDirection="column" mx="0.5rem">
				<Heading mb="0.6rem" size="sm">Transforms</Heading>
				<Select onChange={selectOperation} size="sm">
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
			<Flex flex="2" flexDirection="column" mx="0.5rem">
				<Heading mb="0.6rem" size="sm">Options</Heading>
				<Flex flex="1">
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
				</Flex>
			</Flex>
			<Flex flex="1" flexDirection="column" mx="0.5rem">
				<Heading mb="0.6rem" size="sm">Actions</Heading>
				<Flex flex="1" alignItems="flex-end">
					<Button
						size="sm"
						isDisabled={actionsDisabled}
						onClick={() => handleVips(operation as SharpOperationKey)}
					>
						Apply
					</Button>
				</Flex>
			</Flex>
		</Flex>
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
		<Flex id={key} justifyContent="center" alignItems="center">
			<Text size="sm" mx="0.5rem"> { label } </Text>
			{
				type === "string" && 
				<InputGroup>
					<Input
						defaultValue={defaultValue as string}
						onChange={handleInputChange}
						size="sm"
					/>
				</InputGroup>
			}
			{
				type === "number" && 
				<InputGroup>
					<Input
						defaultValue={defaultValue as string}
						onChange={handleNumberInputChange}
						size="sm"
					/>
				</InputGroup>
			}
			{
				type === "boolean" && 
				<InputGroup>
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