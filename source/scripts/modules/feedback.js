const CustomClass =
{
	INVALID: `invalid`,
	VISIBLE: `visible`,
};

const ErrorMessage =
{
	REQUIRED: `Поле обязательно для заполенения`,
	EMAIL: `Email указан неверно`,
	PHONE: `Телефон указан неверно.`,
};

const returnTrue = () => true;

const validateFilling = ( value ) => value.length !== 0;

const validateEmail =
( email ) =>
{
	const template = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return template.test( String( email ).toLowerCase() );
};

const validatePhone =
( phone ) =>
{
	const template = /^((8|([\+]?7))([\-]| )?)?([\(]?[0-9]{3}[\)]?([\-]| )?)([0-9]|[\-]| ){7,10}$/u;
	return template.test( String( phone ).toLowerCase() );
};

const checkRequiredInput =
( input ) =>
{
	if ( input.required && !validateFilling( input.value ) )
	{
		input.errorMessage = ErrorMessage.REQUIRED;
		return false;
	}
	
	return true;
};

const checkCustomInput =
( input, checkFunction, errorMessage ) =>
{
	if ( checkRequiredInput( input ) )
	{
		if (
			( !input.required && !validateFilling( input.value ) ) ||
			checkFunction( input.value )
		)
		{
			return true;
		}
		
		input.errorMessage = errorMessage;
		return false;
	}
	
	return false;
};

const checkEmailInput =
( input ) =>
{
	return checkCustomInput( input, validateEmail, ErrorMessage.EMAIL );
};

const checkPhoneInput =
( input ) =>
{
	return checkCustomInput( input, validatePhone, ErrorMessage.PHONE );
};

const setCheckFunction =
( input, checkFunction ) =>
{
	input.checkValue = checkFunction.bind( null, input );
	input.errorMessage = ``;
};

const setValidStatusToInput =
( input ) =>
{
	if ( input.classList.contains( CustomClass.INVALID ) )
	{
		input.classList.remove( CustomClass.INVALID );
		input.setCustomValidity = ``;
	}
};

const setInvalidStatusToInput =
( input ) =>
{
	input.classList.add( CustomClass.INVALID );
};

const init
= ( toast ) =>
{
	const feedback = document.querySelector( `body > main > section.feedback` );
	const successBlock = feedback.querySelector( `.success` );
	const form = feedback.querySelector( `form` );
	const inputs = Array.from( form.querySelectorAll( `input` ) );
	const emailInput = form.querySelector( `#feedback-input-email` );
	const phoneInput = form.querySelector( `#feedback-input-phone` );
	const submitButton = form.querySelector( `button[type="submit"]` );
	const policy = feedback.querySelector( `.policy` );
	
	inputs.forEach(
		( input ) =>
		{
			if ( input.required )
			{
				setCheckFunction( input, checkRequiredInput );
			}
			else
			{
				setCheckFunction( input, returnTrue );
			}
			
			input.addEventListener(
				`input`,
				() =>
				{
					if ( input.checkValue() )
					{
						setValidStatusToInput( input );
					}
				}
			);
		}
	);
	
	setCheckFunction( emailInput, checkEmailInput );
	setCheckFunction( phoneInput, checkPhoneInput );
	
	const onFormSubmit =
	( evt ) =>
	{
		evt.preventDefault();
		
		let isFormValid = true;
		for ( let i = 0; i < inputs.length; i++ )
		{
			if ( inputs[i].checkValue() )
			{
				setValidStatusToInput( inputs[i] );
			}
			else
			{
				setInvalidStatusToInput( inputs[i] );
				
				if ( isFormValid )
				{
					inputs[i].focus();
	
					toast.warn( inputs[i].errorMessage );
					isFormValid = false;
				}
			}
		}
		
		if ( isFormValid )
		{
			successBlock.classList.add( CustomClass.VISIBLE );
			setTimeout(
				() =>
				{
					successBlock.classList.remove( CustomClass.VISIBLE );
				},
				2000
			);
			
			inputs.forEach(
				( input ) =>
				{
					input.value = ``;
				}
			);
		}
	};
	
	submitButton.addEventListener( `click`, onFormSubmit );
	form.addEventListener( `submit`, onFormSubmit );
	
	policy.addEventListener(
		`click`,
		( evt ) =>
		{
			evt.preventDefault();
			
			toast.info( `Данная страница отсуствует` );
		}
	);
};

export
{
	init,
};
