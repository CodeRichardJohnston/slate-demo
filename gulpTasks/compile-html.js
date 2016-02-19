/* ============================================================ *\
    COMPILE TEMPLATES / HTML
\* ============================================================ */

var rename = require('gulp-rename');
var handlebars = require('gulp-compile-handlebars');

var handlebarsConfig = require('../_config/handlebars.json');
var templateDataJson = require('../_config/templateData.json');
var templateHelpers = require('../_config/templateHelpers.js')();

module.exports = function(gulp) {

    gulp.task('compile-html', function () {
			var contentful = require('contentful');
				var client = contentful.createClient({
				accessToken: '846c64678f0b76bb5610f7dc0c9614bf6daf368bdc593099005ac0cfcd0712ea',
				space: 'xw6rzdftxrbl'
			});

			client.entry('2nRTiGAvFaCEsWMoUoKIcc')
				.then(function (entry) {
					options = {
	            batch : handlebarsConfig.partials,
	            helpers: templateHelpers
	        }

	        return gulp.src(handlebarsConfig.views)
	            .pipe(handlebars(entry, options))
	            .pipe(rename({extname: '.html'}))
	            .pipe(gulp.dest('build'));
				})
    });
}
