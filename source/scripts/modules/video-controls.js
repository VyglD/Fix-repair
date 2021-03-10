import {createElement} from "./utils";

const VIDEO_CONTROLS_TEMPLATE = ( `
	<div class="controls-wrapper">
		<div class="progress-bar" data-type="custom-range">
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
				<div class="volume-range" data-type="custom-range">
					<button type="button" aria-label="Изменить громкость">
					</button>
				</div>
			</div>
			<div class="time-wrapper">
				<span>00:00</span>
				<span>/</span>
				<span>00:00</span>
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
						<button type="button">0.5</button>
					</li>
					<li>
						<button class="checked" type="button">1</button>
					</li>
					<li>
						<button type="button">1.5</button>
					</li>
					<li>
						<button type="button">2</button>
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

const init =
() =>
{
	const videoControls = createElement( VIDEO_CONTROLS_TEMPLATE );
	
	const videoWrapper = document.querySelector(
		`body > main > section.banner > .video-wrapper`
	);
	const videoPlayer = videoWrapper.querySelector( `video` );
	const playButton = videoControls.querySelector( `.play-button` );
	
	const handleInitControls =
	() =>
	{
		videoControls.classList.add( `visible` );
		
		playButton.removeEventListener( `click`, handleInitControls );
	};
	
	playButton.addEventListener( `click`, handleInitControls );
	
	videoWrapper.appendChild( videoControls );
	
	videoPlayer.controls = false;
};

export
{
	init,
};
