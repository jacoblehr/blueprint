import { SharpOperation } from "../../common/types";
import { SharpOption } from "../../common/options";

export type Action = {
	key: typeof SharpOperation;
	label: string;
	icon?: JSX.Element;
	options: Array<SharpOption>;
};

export type ActionRef = Pick<Action, "key" | "label">;