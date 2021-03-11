import {Key} from "./constants";

const createElement =
( template ) =>
{
	const wrapper = document.createElement( `div` );
	wrapper.innerHTML = template;
	
	return wrapper.firstElementChild;
};

const isLeftKey =
( evt ) =>
{
	return evt.code === Key.LEFT;
};

const isRightKey =
( evt ) =>
{
	return evt.code === Key.RIGHT;
};

export
{
	createElement,
	isLeftKey,
	isRightKey,
};
