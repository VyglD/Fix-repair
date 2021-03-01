const customClass =
{
	VISIBLE: `visible`,
	INFO: `info`,
	WARNING: `warning`,
};

const SHOW_TIME = 2000;

const getToast =
() =>
{
	const toast = document.querySelector( `body > .toast` );
	const messageBlock = toast.querySelector( `.message` );
	const timer = toast.querySelector( `.timer` );
	const closeButton = toast.querySelector( `button` );
	
	const defaultClasses = toast.className;
	
	let lastToastTimeout = null;
	
	const closeToast =
	() =>
	{
		toast.className = defaultClasses;
	};
	
	const showToast =
	() =>
	{
		toast.classList.add( customClass.VISIBLE );
		timer.remove();
		
		if ( lastToastTimeout )
		{
			clearTimeout( lastToastTimeout );
		}
		
		lastToastTimeout = setTimeout( closeToast, SHOW_TIME );
		toast.appendChild( timer );
	};
	
	const showMessage =
	( className, message ) =>
	{
		toast.className = defaultClasses;
		toast.classList.add( className );
		messageBlock.textContent = message;
		
		showToast();
	};
	
	const info =
	( message ) =>
	{
		showMessage( customClass.INFO, message );
	};
	
	const warn =
	( message ) =>
	{
		showMessage( customClass.WARNING, message );
	};
	
	closeButton.addEventListener( `click`, closeToast );
	timer.style.setProperty( `animation-duration`, `${SHOW_TIME / 1000}s` );
	
	return {info, warn};
};

export
{
	getToast,
};
