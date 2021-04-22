import * as React from "react";
import { 
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Button,
	Flex, 
	Heading,
	Icon,
	Stack
} from "@chakra-ui/react";

import { FaRegFolderOpen as Open, FaRegSave as Save } from "react-icons/fa";
import { FiLayers as Layers } from "react-icons/fi";

import { useOpenImage, useSaveImage } from "../hooks/ipc";
import { useAppContext } from "../context/AppContextProvider";

import { Image } from "../hooks/images";
import { SmallCloseIcon } from "@chakra-ui/icons";

type SideBarProps = {
	
};

export const Sidebar = ({  }: SideBarProps) => {
	const { images, tabs } = useAppContext();
	const { mutateAsync: openImage } = useOpenImage();
	const { mutateAsync: saveImage } = useSaveImage();
	
	const handleOpen = async () => {
		const result = await openImage();
		if(!!result.file) {
			const pathTokens = result.file.split("/");
			tabs.add({
				key: result.file,
				file: result.file,
				data: result.data,
				metadata: result.metadata,
				title: pathTokens[pathTokens.length - 1]
			});
		}
	};

	const handleSave = async () => {
		const activeTab = tabs?.data[tabs.active];
		const activeImage = images?.data.find((img: Image) => img.key === activeTab.key);

		if(activeImage) {
			const result = await saveImage({ data: activeImage.preview ?? activeImage.data });

			if(!!result.file) {
				const pathTokens = result.file.split("/");
				tabs.update(tabs.active, {
					...activeTab,
					key: result.file,
					file: result.file,
					data: result.data,
					metadata: result.metadata,
					preview: null,
					title: pathTokens[pathTokens.length - 1]
				});
			}
			
		}
	};

	const handleImageLinkClick = (img: Image) => {
		const pathTokens = img.file.split("/");
		
		tabs.add({
			key: img.key,
			file: img.file,
			data: img.data,
			metadata: img.metadata,
			title: pathTokens[pathTokens.length - 1]
		});
	};

	const handleImageClose = (img: Image) => {
		tabs.removeByKey(img.key);
		images.remove(img.key);
	};

	return (
		<Flex
			direction="column"
			height="100%" 
			width="auto"
			borderRight="1px solid"
			borderColor="gray.300"
			overflow="auto"
			justifyContent="space-between"
			py="1rem"
		>
			<Flex direction="column">
				<Flex alignItems="center" justifyContent="center" mb="1rem">
					<Icon as={Layers} color="blue.500" />
					<Heading size="md" px={4} py={2} fontWeight="normal">Blueprint</Heading>
				</Flex>
				<Accordion defaultIndex={[0]} allowMultiple={true}>
					<AccordionItem>
						<AccordionButton 
							display="flex" 
							flex="1" 
							justifyContent="space-between"
							_focus={{
								outline: "none"
							}}
							borderBottom="1px solid" 
							borderBottomColor="gray.200"
						>
							<Heading size="sm" fontWeight="normal">Images</Heading>
							<AccordionIcon />
						</AccordionButton>
						<AccordionPanel padding="1rem">
							{ 
								images?.data?.map((img: Image, index: number) => {
									const pathTokens = img.file.split("/");
									const activeTab = tabs?.data[tabs.active];
									const isActive = activeTab?.key === img.key;

									return (
										<Flex 
											p="0.5rem"
											borderRadius="0.25rem"
											backgroundColor={isActive ? "gray.100" : "transparent"}
											_hover={{
												backgroundColor: "gray.100"
											}}
											flex="1"
											alignItems="center"
											justifyContent="space-between"
											key={`img-${img.key}`}
											cursor="pointer"
											maxHeight="2rem"
											isTruncated={true}
											onClick={() => handleImageLinkClick(img)}
										>
											<Heading isTruncated={true} size="xs" fontWeight="normal">{ pathTokens[pathTokens.length - 1] }</Heading>
											<SmallCloseIcon 
												onClick={(e) => {
													e.stopPropagation();
													handleImageClose(img);
												}} 
												color="gray.300" 
												_hover={{ color: "blue.500" }} 
											/>
										</Flex>
									)
								})
							}
						</AccordionPanel>
					</AccordionItem>
				</Accordion>
			</Flex>
			<Stack display="flex" flexDirection="column" alignItems="center" justifyContent="center" px="1rem">
				<ActionButton action={handleOpen} icon={Open} label="Open" />
				<ActionButton action={handleSave} icon={Save} label="Save" />
			</Stack>
		</Flex>
	);
}

type ActionButtonProps = {
	label: string;
	icon: any;
	action: () => void;
}

export const ActionButton = ({ action, icon, label }: ActionButtonProps) => {
	const ActionIcon = <Icon fontSize="xs" aria-label={label} as={icon} />;

	return (
		<Button 
			width="100%"
			onClick={action} 
			size="sm"
			variant="outline"
			leftIcon={ActionIcon}
			_focus={{ outline: "none" }}
		>
			{ label }
		</Button>
	);
}