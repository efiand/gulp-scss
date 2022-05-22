import autoprefixer from 'autoprefixer';
import gulp from 'gulp';
import mqpacker from 'postcss-sort-media-queries';
import postcss from 'gulp-postcss';
import sass from "gulp-dart-sass";
import server from 'browser-sync';

const { src, dest, watch, series } = gulp;

const buildStyles = () => src([
	'source/styles/**/*.scss',
	'!source/styles/**/_*.scss'
], { sourcemaps: true })
	.pipe(sass().on("error", sass.logError))
	.pipe(postcss([
		mqpacker(),
		autoprefixer()
	]))
	.pipe(dest('public/styles'), { sourcemaps: '.' });

export const reload = (done) => {
	server.reload();
	done();
};

export const startServer = (done) => {
	server.init({
		cors: true,
		server: 'public',
		ui: false
	});

	watch('**/*.{html,js}', reload);
	watch('source/styles/**/*.scss', series(buildStyles, reload));

	done();
};

export const build = buildStyles;
export default series(build, startServer);
