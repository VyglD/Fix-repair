const createElement =
( template ) =>
{
	const wrapper = document.createElement( `div` );
	wrapper.innerHTML = template;
	
	return wrapper.firstElementChild;
};

export
{
	createElement,
};
