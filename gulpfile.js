const argv = require( `yargs` ).argv;
const babelify = require( `babelify` );
const browserify = require( `browserify` );
const clean = require( `gulp-clean` );
const gulp = require( `gulp` );
const gulpif = require( `gulp-if` );
const htmlHint = require( `gulp-htmlhint` );
const htmlValidator = require( `gulp-w3c-html-validator` );
const htmlmin = require( `gulp-htmlmin` );
const imagemin = require( `gulp-imagemin` );
const rename = require( `gulp-rename` );
const postcss = require( `gulp-postcss` );
const postcssAutoprefixer = require( `autoprefixer` );
const postcssCSSO = require( `postcss-csso` );
const postcssCustomProperties = require( `postcss-custom-properties` );
const postcssImport = require( `postcss-import` );
const postcssPresetEnv = require( `postcss-preset-env` );
const server = require( `browser-sync` ).create();
const svgSprite = require( `gulp-svg-sprite` );
const sourcemap = require( `gulp-sourcemaps` );
const terser = require( `gulp-terser` );
const vinylSource = require( `vinyl-source-stream` );
const vinylBuffer = require( `vinyl-buffer` );

const SRC_FOLDER = {
	SRC: `source`,
	MARKUP: `markup`,
	CSS: `styles`,
	JS: `scripts`,
	IMG: `images`,
	STATIC: `static`,
};

const BUILD_FOLDER = {
	BUILD: `build`,
	CSS: `css`,
	JS: `js`,
	IMG: `img`,
	FONTS: `fonts`,
};

const PATH = {
	SRC_ROOT: SRC_FOLDER.SRC,
	SRC_HTML: `${SRC_FOLDER.SRC}/${SRC_FOLDER.MARKUP}`,
	SRC_CSS: `${SRC_FOLDER.SRC}/${SRC_FOLDER.CSS}`,
	SRC_JS: `${SRC_FOLDER.SRC}/${SRC_FOLDER.JS}`,
	SRC_IMG: `${SRC_FOLDER.SRC}/${SRC_FOLDER.IMG}`,
	SRC_STATIC: `${SRC_FOLDER.SRC}/${SRC_FOLDER.STATIC}`,
	BUILD_ROOT: BUILD_FOLDER.BUILD,
	BUILD_HTML: BUILD_FOLDER.BUILD,
	BUILD_CSS: `${BUILD_FOLDER.BUILD}/${BUILD_FOLDER.CSS}`,
	BUILD_JS: `${BUILD_FOLDER.BUILD}/${BUILD_FOLDER.JS}`,
	BUILD_IMG: `${BUILD_FOLDER.BUILD}/${BUILD_FOLDER.IMG}`,
};

const copy = ( paths, base = PATH.SRC_ROOT ) =>
{
	return gulp.src( paths, {base, allowEmpty: true} )
		.pipe( gulp.dest( PATH.BUILD_ROOT ) );
};

const minifyPictures = ( paths ) =>
{
	return gulp.src( paths, {base: PATH.SRC_IMG} )
		.pipe(
			gulpif(
				argv.production,
				imagemin(
					[
						imagemin.mozjpeg( {progressive: true} ),
						imagemin.optipng( {optimizationLevel: 3} ),
						imagemin.svgo( {plugins: [{removeViewBox: false}]} )
					]
				)
			)
		)
		.pipe( gulp.dest( PATH.BUILD_IMG ) );
};

const createSvgSprite = () =>
{
	return gulp.src( `${PATH.SRC_IMG}/**/*.svg` )
		.pipe(
			svgSprite(
				{
					mode:
						{
							stack:
								{
									sprite: `../sprite.svg`,
								}
						},
				}
			)
		)
		.pipe( gulp.dest( PATH.BUILD_IMG ) );
};

const addNewSvg = ( path ) =>
{
	minifyPictures( [path] );
	createSvgSprite();
};

gulp.task(
	`test-html`,
	() =>
	{
		return gulp.src(
			[
				`${PATH.SRC_HTML}/**/*.html`,
				`${PATH.BUILD_HTML}/*.html`
			]
		)
			.pipe( htmlHint( `.htmlhintrc` ) )
			.pipe( htmlHint.reporter() )
			.pipe( htmlValidator() )
			.pipe( htmlValidator.reporter() );
	}
);

gulp.task( `test`, gulp.series( `test-html` ) );

gulp.task(
	`clean`,
	() =>
	{
		return gulp.src( PATH.BUILD_ROOT, {allowEmpty: true} )
			.pipe( clean() );
	}
);

gulp.task(
	`copy-static-files`,
	() =>
	{
		return copy( `${PATH.SRC_STATIC}/**/*`, PATH.SRC_STATIC );
	}
);

gulp.task(
	`minify-pictures`,
	() =>
	{
		return minifyPictures(
			[`${PATH.SRC_IMG}/**/*.{png,jpg,svg,webp,ico}`]
		);
	}
);

gulp.task( `svg-sprite`, createSvgSprite );

gulp.task(
	`markup`,
	() =>
	{
		return gulp.src( `${PATH.SRC_HTML}/**/*.html` )
			.pipe(
				gulpif(
					argv.production,
					htmlmin(
						{
							collapseWhitespace: true,
							removeComments: true,
							removeRedundantAttributes: true,
						}
					)
				)
			)
			.pipe( gulp.dest( PATH.BUILD_HTML ) );
	}
);

gulp.task(
	`styles`,
	() =>
	{
		const isProd = Boolean( argv.production );
		const processors =
		[
			postcssImport,
			postcssCustomProperties,
			postcssPresetEnv,
			postcssAutoprefixer,
			postcssCSSO(
				{
					comments: false,
				}
			),
		];
		
		return gulp.src( `${PATH.SRC_CSS}/index.css` )
			.pipe(
				gulpif(
					!isProd,
					sourcemap.init()
				)
			)
			.pipe( postcss( processors ) )
			.pipe( rename( `style.min.css` ) )
			.pipe(
				gulpif(
					!isProd,
					sourcemap.write()
				)
			)
			.pipe( gulp.dest( PATH.BUILD_CSS ) );
	}
);

gulp.task(
	`scripts`,
	() =>
	{
		const isProd = Boolean( argv.production );
		
		return Promise.resolve(
			browserify(
				{
					entries: `${PATH.SRC_JS}/index.js`,
					debug: !isProd
				}
			)
				.transform( babelify )
				.bundle()
				.pipe( vinylSource( `bundle.js` ) )
				.pipe( vinylBuffer() )
				.pipe(
					gulpif(
						!isProd,
						sourcemap.init( {loadMaps: true} )
					)
				)
				.pipe(
					gulpif(
						isProd,
						terser()
					)
				)
				.pipe( rename( `app.min.js` ) )
				.pipe(
					gulpif(
						!isProd,
						sourcemap.write()
					)
				)
				.pipe( gulp.dest( PATH.BUILD_JS ) )
		)
			.catch( () => {} );
	}
);

gulp.task(
	`build`,
	gulp.series(
		`clean`,
		`copy-static-files`,
		`minify-pictures`,
		`svg-sprite`,
		`markup`,
		`styles`,
		`scripts`
	)
);

gulp.task(
	`refresh`,
	() =>
	{
		server.reload();
	}
);

gulp.task(
	`server`,
	() =>
	{
		server.init(
			{
				server: PATH.BUILD_ROOT,
				port: 7951,
				open: true,
				cors: true,
				ui: false,
			}
		);
		
		gulp.watch( `${PATH.SRC_HTML}/**/*.html` )
			.on( `all`, gulp.series( `markup`, `refresh` ) );
		gulp.watch( `${PATH.SRC_CSS}/**/*.css` )
			.on( `all`, gulp.series( `styles`, `refresh` ) );
		gulp.watch( `${PATH.SRC_JS}/**/*.js` )
			.on( `all`, gulp.series( `scripts`, `refresh` ) );
		gulp.watch( `${PATH.SRC_IMG}/**/*.{png,jpg,webp}` )
			.on(
				`add`,
				( args ) =>
				{
					minifyPictures( args );
					server.reload();
				}
			);
		gulp.watch( `${PATH.SRC_IMG}/**/*.svg` )
			.on(
				`add`,
				( args ) =>
				{
					addNewSvg( args );
					server.reload();
				}
			);
		gulp.watch( `${PATH.SRC_IMG}/**/*.svg` )
			.on(
				`change`,
				( args ) =>
				{
					copy( args );
					createSvgSprite();
					server.reload();
				}
			);
		gulp.watch( `${PATH.SRC_STATIC}/**/*` )
			.on(
				`all`,
				gulp.series( `copy-static-files`, `markup`, `refresh` )
			);
	}
);

gulp.task( `start`, gulp.series( `build`, `server` ) );
