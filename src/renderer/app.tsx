import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ChakraProvider } from "@chakra-ui/react";

import { AppContextProvider } from './context/AppContextProvider';
import { QueryClientProvider } from "./context/QueryClientProvider";

import { Layout } from "./views/Layout";

const App = () => {
	return (
		<ChakraProvider>
			<AppContextProvider>
				<QueryClientProvider>
					<Layout />
				</QueryClientProvider>
			</AppContextProvider>
		</ChakraProvider>
	)
}
		
export const render = () => {
	ReactDOM.render(<App />, document.querySelector("#root"));
};	