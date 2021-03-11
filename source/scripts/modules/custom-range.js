import {isLeftKey, isRightKey} from "../modules/utils";

const RANGE_OFFSET = `--line-progress`;

const VISIBLE_CLASS = `visible`;

const doNothing = () => {};

class CustomRange
{
	constructor( customRangeSelector, initValue, customCallback = {} )
	{
		this._range = document.querySelector( customRangeSelector );
		this._rangePoint = this._range.querySelector( `button` );
		
		const {
			mouseDownCallback = doNothing,
			mouseMoveCallback = doNothing,
			mouseUpCallback = doNothing,
		} = customCallback;
		
		this._mouseDownCallback = mouseDownCallback;
		this._mouseMoveCallback = mouseMoveCallback;
		this._mouseUpCallback = mouseUpCallback;
		
		this._currentOffset = initValue;
		
		this.setOffset( initValue );
		
		this._handleMouseDown = this._handleMouseDown.bind( this );
		this._handleMouseMove = this._handleMouseMove.bind( this );
		this._handleMouseUp = this._handleMouseUp.bind( this );
		this._handleArrowDown = this._handleArrowDown.bind( this );
	}
	
	init()
	{
		this._range.addEventListener( `mousedown`, this._handleMouseDown );
		this._rangePoint.addEventListener( `keydown`, this._handleArrowDown );
	}
	
	setOffset( offset )
	{
		offset = this._applyOffsetBorders( offset );
		
		this._currentOffset = offset;
		
		this._range.style.setProperty( RANGE_OFFSET, `${offset}%` );
	}
	
	getOffset()
	{
		return this._currentOffset;
	}
	
	getRange()
	{
		return this._range;
	}
	
	_applyOffsetBorders( offset )
	{
		if ( offset < 0 )
		{
			offset = 0;
		}
		
		if ( offset > 100 )
		{
			offset = 100;
		}
		
		return offset;
	}
	
	_calculateOffset( x )
	{
		let offset = x - this._range.getBoundingClientRect().left;
		offset = offset < 0 ? 0 : offset;
		offset = offset > this._range.offsetWidth
			? this._range.offsetWidth
			: offset;
		
		return this._applyOffsetBorders( offset / this._range.offsetWidth * 100 );
	}
	
	_handleMouseDown( downEvt )
	{
		this._range.classList.add( VISIBLE_CLASS );
		
		document.addEventListener( `mousemove`, this._handleMouseMove );
		document.addEventListener( `mouseup`, this._handleMouseUp );
		
		const offset = this._calculateOffset( downEvt.x );
		
		this.setOffset( offset );
		
		this._mouseDownCallback( offset );
	}
	
	_handleMouseMove( moveEvt )
	{
		const offset = this._calculateOffset( moveEvt.x );
		
		this.setOffset( offset );
		
		this._mouseMoveCallback( offset );
	}
	
	_handleMouseUp( upEvt )
	{
		const offset = this._calculateOffset( upEvt.x );
		
		this.setOffset( offset );
		
		this._mouseUpCallback( offset );
		
		this._range.classList.remove( VISIBLE_CLASS );
		
		document.removeEventListener( `mousemove`, this._handleMouseMove );
		document.removeEventListener( `mouseup`, this._handleMouseUp );
		
		this._rangePoint.focus();
	}
	
	_handleArrowDown( downEvt )
	{
		if ( isLeftKey( downEvt ) || isRightKey( downEvt ) )
		{
			let offset = this.getOffset();
			
			if ( isLeftKey( downEvt ) )
			{
				offset = --offset;
			}
			else if ( isRightKey( downEvt ) )
			{
				offset = ++offset;
			}
			
			offset = this._applyOffsetBorders( offset );
			
			this.setOffset( offset );
			
			this._mouseDownCallback( offset );
			this._mouseMoveCallback( offset );
			this._mouseUpCallback( offset );
		}
	}
}

export default CustomRange;
