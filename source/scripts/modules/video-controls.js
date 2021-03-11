import CustomRange from "./custom-range";
import {createElement} from "./utils";

const CustomClass =
{
	VISIBLE: `visible`,
	PLAY_BUTTON: `play-button`,
	PAUSE_BUTTON: `pause-button`,
	MUTE: `mute`,
	SELECTED: `selected`,
};

const VIDEO_CONTROLS_TEMPLATE = ( `
	<div class="controls-wrapper">
		<div class="progress-bar" data-type="custom-range" id="progress-bar-js">
			<button type="button" aria-label="Изменить время"></button>
		</div>
		<div class="control-buttons-wrapper">
			<button
				class="play-button control-button"
				type="button"
			>
				Смотреть видео
			</button>
			<div class="volume-wrapper">
				<button
					class="volume-button control-button"
					type="button"
					aria-label="Включить/отключить звук"
				>
				</button>
				<div
					class="volume-range"
					data-type="custom-range"
					data-volume-value="1"
					id="volume-range-js"
				>
					<button type="button" aria-label="Изменить громкость">
					</button>
				</div>
			</div>
			<div class="time-wrapper">
				<span class="current-time">00:00</span>
				<span>/</span>
				<span class="duration">00:00</span>
			</div>
			<div class="speed-wrapper">
				<button
					class="speed-button control-button"
					type="button"
					aria-label="Изменить скорость"
				>
				</button>
				<ul class="speed-list">
					<li>
						<button
							type="button"
							data-value="0.5"
						>
							0.5
						</button>
					</li>
					<li>
						<button
							class="${CustomClass.SELECTED}"
							type="button"
							data-value="1"
						>
							1
						</button>
					</li>
					<li>
						<button
							type="button"
							data-value="1.5"
						>
							1.5
						</button>
					</li>
					<li>
						<button
							type="button"
							data-value="2"
						>
							2
						</button>
					</li>
				</ul>
			</div>
			<button
				class="fullscreen-button control-button"
				type="button"
				aria-label="Открыть видео на весь экран"
			>
			</button>
		</div>
	</div>
` );

const getFormatNumberString =
( number ) =>
{
	return String( parseInt( number, 10 ) ).padStart( 2, 0 );
};

const getTimeString =
( time ) =>
{
	time = parseFloat( time, 10 );
	
	const seconds = getFormatNumberString( time % 60 );
	const minutes = getFormatNumberString( time / 60 );
	
	return `${minutes}:${seconds}`;
};

const init =
() =>
{
	const videoControls = createElement( VIDEO_CONTROLS_TEMPLATE );
	
	const videoWrapper = document.querySelector(
		`body > main > section.banner > .video-wrapper`
	);
	const videoPlayer = videoWrapper.querySelector( `video` );
	const playButton = videoControls.querySelector( `.play-button` );
	const volumeButton = videoControls.querySelector( `.volume-button` );
	const currentTimeContainer = videoControls.querySelector( `.current-time` );
	const durationContainer = videoControls.querySelector( `.duration` );
	const speedButton = videoControls.querySelector( `.speed-button` );
	const speedList = videoControls.querySelector( `.speed-list` );
	const speedListItems = Array.from( speedList.querySelectorAll( `button` ) );
	const fullscreenButton = videoControls.querySelector( `.fullscreen-button` );
	
	const playVideo =
	() =>
	{
		videoPlayer.play();
		
		playButton.classList.remove( CustomClass.PLAY_BUTTON );
		playButton.classList.add( CustomClass.PAUSE_BUTTON );
	};
	
	const pauseVideo =
	() =>
	{
		videoPlayer.pause();
		
		playButton.classList.remove( CustomClass.PAUSE_BUTTON );
		playButton.classList.add( CustomClass.PLAY_BUTTON );
	};
	
	const getVolume =
	() =>
	{
		return parseFloat( volumeRangeNode.dataset.volumeValue, 10 );
	};
	
	const getCurrentSpeedListItem =
	() =>
	{
		return speedListItems.find(
			( item ) =>
			{
				return item.classList.contains( CustomClass.SELECTED );
			}
			
		);
	};
	
	const setCurrentTime =
	( time ) =>
	{
		currentTimeContainer.textContent = getTimeString( time );
	};
	
	const toggleStatusVideo =
	() =>
	{
		if ( videoPlayer.paused )
		{
			playVideo();
		}
		else
		{
			pauseVideo();
		}
	};
	
	const handleInitControls =
	() =>
	{
		videoControls.classList.add( CustomClass.VISIBLE );
		
		videoPlayer.addEventListener( `click`, handleVideoPlayerClick );
		
		playButton.removeEventListener( `click`, handleInitControls );
		playButton.addEventListener( `click`, handlePlayButtonClick );
		
		durationContainer.textContent = getTimeString( videoPlayer.duration );
		
		playVideo();
	};
	
	const handleVideoPlayerClick =
	() =>
	{
		toggleStatusVideo();
		
		playButton.focus();
	};
	
	const handlePlayButtonClick =
	() =>
	{
		toggleStatusVideo();
	};
	
	const handleVideoProgress =
	() =>
	{
		setCurrentTime( videoPlayer.currentTime );
		
		const progress = videoPlayer.currentTime / videoPlayer.duration * 100;
		
		progressBar.setOffset( progress );
	};
	
	const getProgressBarCallback =
	() =>
	{
		let played = false;
		
		const setNewTime =
		( offset ) =>
		{
			const newTime = offset / 100 * videoPlayer.duration;
			
			videoPlayer.currentTime = newTime;
			
			setCurrentTime( newTime );
		};
		
		const mouseDownCallback =
		( offset ) =>
		{
			played = !videoPlayer.paused;
			
			if ( played )
			{
				pauseVideo();
			}
			
			setNewTime( offset );
			
			videoPlayer.removeEventListener( `timeupdate`, handleVideoProgress );
		};
		
		const mouseUpCallback =
		( offset ) =>
		{
			
			setNewTime( offset );
			
			videoPlayer.addEventListener( `timeupdate`, handleVideoProgress );
			
			if ( played )
			{
				playVideo();
			}
		};
		
		return {
			mouseDownCallback,
			mouseMoveCallback: setNewTime,
			mouseUpCallback,
		};
	};
	
	const handleVolumeButtonClick =
	() =>
	{
		if ( volumeButton.classList.contains( CustomClass.MUTE ) )
		{
			const newVolume = getVolume();
			
			videoPlayer.volume = newVolume;
			volumeRange.setOffset( newVolume * 100 );
			
			volumeButton.classList.remove( CustomClass.MUTE );
		}
		else
		{
			const newVolume = 0;
			
			videoPlayer.volume = newVolume;
			volumeRange.setOffset( newVolume * 100 );
			
			volumeButton.classList.add( CustomClass.MUTE );
		}
	};
	
	const handleVolumeChange =
	( offset ) =>
	{
		const newVolumeValue = offset / 100;
		
		if ( newVolumeValue === 0 )
		{
			volumeButton.classList.add( CustomClass.MUTE );
		}
		else if ( newVolumeValue > 0
			&& volumeButton.classList.contains( CustomClass.MUTE ) )
		{
			volumeButton.classList.remove( CustomClass.MUTE );
		}
		
		volumeRangeNode.dataset.volumeValue = newVolumeValue;
		
		videoPlayer.volume = newVolumeValue;
	};
	
	const handleSpeedButtonClick =
	() =>
	{
		if ( speedList.classList.contains( CustomClass.VISIBLE ) )
		{
			speedList.classList.remove( CustomClass.VISIBLE );
		}
		else
		{
			const currentSpeedListItem = getCurrentSpeedListItem();
			
			speedList.classList.add( CustomClass.VISIBLE );
			
			currentSpeedListItem.focus();
		}
	};
	
	const hanleSpeedListItemSelect =
	( evt ) =>
	{
		const currentSpeedListItem = getCurrentSpeedListItem();
		
		currentSpeedListItem.classList.remove( CustomClass.SELECTED );
		
		videoPlayer.playbackRate = parseFloat( evt.target.dataset.value, 10 );
		
		evt.target.classList.add( CustomClass.SELECTED );
		
		speedList.classList.remove( CustomClass.VISIBLE );
		
		speedButton.focus();
	};
	
	const handleFullscreenButtonClick =
	() =>
	{
		if ( document.fullscreenElement === videoWrapper )
		{
			document.exitFullscreen();
		}
		else
		{
			videoWrapper.requestFullscreen();
		}
	};
	
	videoPlayer.addEventListener( `timeupdate`, handleVideoProgress );
	videoPlayer.addEventListener( `ended`, pauseVideo );
	
	playButton.addEventListener( `click`, handleInitControls );
	
	volumeButton.addEventListener( `click`, handleVolumeButtonClick );
	
	speedButton.addEventListener( `click`, handleSpeedButtonClick );
	speedListItems.forEach(
		( speedListItem ) =>
		{
			speedListItem.addEventListener( `click`, hanleSpeedListItemSelect );
		}
	);
	
	fullscreenButton.addEventListener( `click`, handleFullscreenButtonClick );
	
	videoWrapper.appendChild( videoControls );
	
	const volumeRange = new CustomRange(
		`#volume-range-js`,
		100,
		{
			mouseDownCallback: handleVolumeChange,
			mouseMoveCallback: handleVolumeChange,
			mouseUpCallback: handleVolumeChange,
		}
	);
	const volumeRangeNode = volumeRange.getRange();
	volumeRange.init();
	
	const progressBar = new CustomRange(
		`#progress-bar-js`,
		0,
		getProgressBarCallback()
	);
	progressBar.init();
	
	videoPlayer.controls = false;
};

export
{
	init,
};
