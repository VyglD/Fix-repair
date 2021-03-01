const customClass =
{
	ACTIVE_SLIDE: `active`,
	NO_JS: `no-js`,
};

const getNextArrayIndex = ( currentIndex, arr ) =>
{
	/* eslint-disable-next-line space-in-parens*/
	return (currentIndex + 1) % arr.length;
};

const getPreviousArrayIndex = ( currentIndex, arr ) =>
{
	/* eslint-disable-next-line space-in-parens*/
	return (currentIndex + (arr.length - 1)) % arr.length;
};

const init = () =>
{
	const slider = document.querySelector( `body > main > section.slider` );
	const buttonsWrapper = slider.querySelector( `.buttons-wrapper` );
	const nextButton = buttonsWrapper.querySelector( `button.next` );
	const previousButton = buttonsWrapper.querySelector( `button.previous` );
	const slidesWrapper = slider.querySelector( `ul` );
	const slides = Array.from( slidesWrapper.querySelectorAll( `li` ) );

	const setActiveSlide = ( index ) =>
	{
		if ( slides[index] )
		{
			slides[index].classList.add( customClass.ACTIVE_SLIDE );
			
			slidesWrapper.style.setProperty( `--active-slide`, index );
		}
	};
	
	const setButtonListener = ( button, getArrayIndex ) =>
	{
		button.addEventListener(
			`click`,
			() =>
			{
				const activeSlideIndex = slides.findIndex(
					( slide ) =>
					{
						return slide.classList.contains(
							customClass.ACTIVE_SLIDE
						);
					}
				);
				
				slides[activeSlideIndex].classList.remove(
					customClass.ACTIVE_SLIDE
				);
				
				setActiveSlide(
					getArrayIndex( activeSlideIndex, slides )
				);
			}
		);
	};
	
	setButtonListener( nextButton, getNextArrayIndex );
	setButtonListener( previousButton, getPreviousArrayIndex );
	
	setActiveSlide( 1 );
	
	slidesWrapper.classList.remove( customClass.NO_JS );
	buttonsWrapper.classList.remove( customClass.NO_JS );
};

export {
	init,
};
