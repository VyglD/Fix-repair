import {getToast} from "./modules/toast";
import {init as initFeedback} from "./modules/feedback";
import {init as initSlider} from "./modules/slider";

const toast = getToast();

const showBlankMessage =
( evt ) =>
{
	evt.preventDefault();
	
	toast.info( `Данная страница отсуствует` );
};

initSlider();
initFeedback( toast );

document.querySelectorAll( `[data-blank-status]` )
	.forEach(
		( node ) =>
		{
			node.addEventListener( `click`, showBlankMessage );
		}
	);
