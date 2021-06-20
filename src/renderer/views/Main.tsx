import * as React from "react";
import { Flex, Image, Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react"
import { useAppContext } from "../context/AppContextProvider";
import { CloseIcon } from "@chakra-ui/icons";
import { getDataURL } from "../util/string";
import { ControlPanel } from "../components/ControlPanel";
import { Resizable, ResizableProps } from "re-resizable";

type MainProps = {

}

export const Main = ({  }: MainProps) => {
	const { images, tabs } = useAppContext();

	const handleTabChange = (index: number) => {
		tabs.setActive(index);
	};
	
    return (
		// <Flex flex="1" overflow="auto" width="100%" flexDirection="column" pt="0.5rem">
			<Flex flex="1" flexDirection="row" width="100%" height="100%" justifyContent="space-between">
				<Tabs 
					borderBottom="1px solid"
					borderColor="gray.300"
					display="flex"
					flex="1"
					flexDirection="column"
					isLazy
					isManual 
					index={tabs.active} 
					width="100%" 
					variant="enclosed-colored"
					maxHeight="100vh"
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
						position="relative"
					>
						{
							tabs?.data.map((t, index) => {
								const image =  t?.preview || t?.image;
								const metadata = JSON.parse(t.image.metadata);

								const source = getDataURL({ format: metadata.format, data: image.data });

								return (
									<TabPanel 
										key={`tab-panel-${index}`} 
										display="flex"
										flex="1"
										justifyContent="center"
									>	
										<Flex
											overflow="hidden"
											bgImage={`"${source}"`}
											bgSize="contain"
											bgPosition="center"
											bgRepeat="no-repeat"
											width={`min(100%, ${metadata.width}px)`}
											height={`min(100%, ${metadata.height}px)`}
										/>
									</TabPanel>
								);
							})
						}
					</TabPanels>
				</Tabs>
				<Resizable
					handleStyles={{
						topLeft: { display: "none" },
						topRight: { display: "none" },
						bottomLeft: { display: "none" },
						bottomRight: { display: "none" },
						bottom: { display: "none" },
						right: { display: "none" },
					}}
					defaultSize={{ 
						width: "300px",
						height: "100%"
					}}
					minWidth="300px"
					maxWidth="600px"
					minHeight="100%"
					maxHeight="100%"
				>
					<ControlPanel />
				</Resizable>
				
			</Flex>
        // </Flex>
    );
}