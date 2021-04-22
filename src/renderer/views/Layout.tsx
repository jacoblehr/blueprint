import * as React from "react";
import { Flex } from "@chakra-ui/react";

import { Main } from "./Main";
import { Sidebar } from "../components/Sidebar";

import { Resizable } from "re-resizable";

export const Layout = () => {
	return (
		<Flex flex="1" height="100vh">
			<Resizable
				handleStyles={{
					bottom: { display: "none" },
					bottomLeft: { display: "none" },
					bottomRight: { display: "none" }
				}}
				defaultSize={{ 
					width: "20%",
					height: "100%"
				}}
				maxWidth="50%"
				minWidth="200px"
			>
				<Sidebar />
			</Resizable>
			<Main />
		</Flex>
	);
}