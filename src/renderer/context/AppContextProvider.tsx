import * as React from "react";
import { useOperations } from "../hooks/operations";
import { useImages } from "../hooks/images";
import { useTabs } from "../hooks/tabs";

type ImagesController = ReturnType<typeof useImages>;
type TabController = ReturnType<typeof useTabs>;
type OperationsController = ReturnType<typeof useOperations>;

export interface AppContext {
	tabs: TabController;
	images: ImagesController;
	operations: OperationsController;
};

const AppContext = React.createContext<AppContext>({
	tabs: null,
	images: null,
	operations: null
});

export const useAppContext = () => React.useContext<AppContext>(AppContext);

export const AppContextProvider: React.FC = ({ children }) => {
	const imagesController = useImages();
	const tabController = useTabs({
		images: imagesController.data ?? [],
		addImage: imagesController.add,
		updateImage: imagesController.update
	});
	const operationsController = useOperations();

	const context = {
		tabs: {
			...tabController,
			data: [...tabController.data]
		},
		images: {
			...imagesController,
			data: imagesController.data ? [...imagesController.data] : []
		},
		operations: {
			...operationsController,
			options: { ...operationsController.options }
		}
	};

	return (
		<AppContext.Provider value={context}>
			{children}
		</AppContext.Provider>
	);
};
