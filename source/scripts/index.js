import {getToast} from "./modules/toast";
import {init as initFeedback} from "./modules/feedback";
import {init as initSlider} from "./modules/slider";
import {init as initVideoControls} from "./modules/video-controls";

const toast = getToast();

const showBlankMessage =
( evt ) =>
{
	evt.preventDefault();
	
	toast.info( `Данная страница отсуствует` );
};

const animate =
( {timing, draw, duration} ) =>
{
	let start = performance.now();
	
	const animateFraction =
	( time ) =>
	{
		// eslint-disable-next-line space-in-parens
		let timeFraction = (time - start) / duration;
		if ( timeFraction > 1 )
		{
			timeFraction = 1;
		}
		
		let progress = timing( timeFraction );

		draw( progress );
		
		if ( timeFraction < 1 )
		{
			requestAnimationFrame( animateFraction );
		}
	};
	
	requestAnimationFrame( animateFraction );
};

initSlider();
initFeedback( toast );
initVideoControls();

document.querySelectorAll( `[data-blank-status]` )
	.forEach(
		( node ) =>
		{
			node.addEventListener( `click`, showBlankMessage );
		}
	);

document.querySelectorAll( `[data-scroll]` )
	.forEach(
		( node ) =>
		{
			node.addEventListener(
				`click`,
				( evt ) =>
				{
					evt.preventDefault();
					
					const currentYOffset = window.pageYOffset;
					const scrollOffset =
						document.querySelector(
							evt.target.getAttribute( `href` )
						)
							.getBoundingClientRect().y;
					
					animate(
						{
							duration: 500,
							timing( timeFraction )
							{
								return timeFraction;
							},
							draw( progress )
							{
								scrollTo(
									0,
									currentYOffset + scrollOffset * progress
								);
							}
						}
					);
				}
			);
		}
	);
