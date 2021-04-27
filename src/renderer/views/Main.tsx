import * as React from "react";
import { Flex, Image, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import { useAppContext } from "../context/AppContextProvider";
import { CloseIcon } from "@chakra-ui/icons";
import { getDataURL, getFileURL } from "../util/string";
import { ControlPanel } from "../components/ControlPanel";

type MainProps = {

}

export const Main = ({  }: MainProps) => {
	const { images, tabs } = useAppContext();

	const handleTabChange = (index: number) => {
		tabs.setActive(index);
	};
	
    return (
		<Flex flex="1" overflow="auto" width="100%" flexDirection="column" pt="0.5rem">
			<ControlPanel />
			<Flex flex="1" flexDirection="column" width="100%" justifyContent="space-between">
				<Tabs 
					display="flex"
					flex="1"
					flexDirection="column"
					isLazy
					isManual 
					index={tabs.active} 
					width="100%" 
					variant="enclosed-colored"
				>
					<TabList mb="1em">
						{
							tabs?.data.map((t, index) => {
								return (
									<Tab 
										_focus={{ outline: "none" }} 
										alignItems="center" 
										display="flex" 
										justifyContent="space-between" 
										minWidth="160px"
										flexWrap="nowrap"
										isTruncated={true}
										key={`tab-${t.key}`}
										overflow="auto"
										onClick={() => handleTabChange(index)}
									>
										{t.title}
										<CloseIcon 
											marginLeft="0.5rem"
											fontSize="0.6rem"
											color="gray.300"
											cursor="pointer"
											_hover={{
												color: "blue.500"
											}}
											onClick={(e) => {
												e.stopPropagation();
												tabs.remove(index);
											}}
										/>
									</Tab>
								);
							})	
						}
					</TabList>
					<TabPanels
						display="flex"
						flex="1"
						flexDirection="column"
						justifyContent="center"
					>
						{
							tabs?.data.map((t, _index) => {
								const imageIndex = images.data.findIndex((img) => img.key === t.key);
								if(imageIndex == -1) {
									return null;
								}

								const imageData = images.data[imageIndex];
								const image =  images.data[imageIndex]?.preview || images.data[imageIndex]?.image;
								const source = getDataURL({ format: image.metadata.format, data: image.data });

								return (
									<TabPanel 
										key={`tab-panel-${imageData.key}`} 
										display="flex" 
										justifyContent="center"
									>	
										<Image
											src={source}
											width={image.metadata.width}
											height={image.metadata.height}
										/>
									</TabPanel>
								);
							})
						}
					</TabPanels>
				</Tabs>
			</Flex>
        </Flex>
    );
}