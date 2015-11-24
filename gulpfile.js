/* ============================================================ *\
    SETUP
\* ============================================================ */

/*jslint node: true */
'use strict';

// Gulp
var gulp       = require('gulp');
var argv       = require('yargs').argv;
var runSeq     = require('run-sequence');

// Config
var config     = require('./_config/project.json');
var creds      = require('./_config/creds.json');

config.paths   = require('./_config/paths')(config);
var destStyles = config.src + '/' + config.dirs.styles;

/* ============================================================ *\
    TASK MODULES
\* ============================================================ */

require('./gulpTasks/styles.js')(gulp, config, argv, destStyles);
require('./gulpTasks/scripts.js')(gulp, config, argv);
require('./gulpTasks/sprites.js')(gulp, config);
require('./gulpTasks/image-minify.js')(gulp, config, argv);
require('./gulpTasks/copy-assets.js')(gulp, config);
require('./gulpTasks/release.js')(gulp, creds);
require('./gulpTasks/compile-html.js')(gulp);
require('./gulpTasks/local-testing.js')(gulp, config);

/* ============================================================ *\
	MAIN TASKS
\* ============================================================ */

gulp.task('watch:sass', function () {
	if(!argv.prod) {
		gulp.watch(
			[config.paths.src.styles + '**/*.scss', config.dirs.components + '**/*.scss'],
			['sass']
		);
	}
});

gulp.task('watch:js', function () {
	if(!argv.prod) {
		gulp.watch(
			[config.paths.src.scripts + '**/*.js', config.dirs.components + '/**/*.js'],
			['scripts']
		);
	}
});

gulp.task('watch', function (cb) {
	runSeq(['watch:sass', 'watch:js'], cb);
});

gulp.task('build', function (cb) {
	runSeq(['default'], ['copy'], ['compile-html'],  cb);
});

gulp.task('release', function (cb) {
	runSeq(['build'], ['package-release'],  cb);
});

gulp.task('serve', function(cb) {
	runSeq(['localServer'], ['browser-sync'], cb);
});

gulp.task('default', function (cb) {
	runSeq(['sass-generate-contents'],['sass', 'scripts','scripts:vendor' ,'scripts:ie' ,'copy:fonts', 'imagemin'], ['sass:legacy:ie8'], cb);
});
