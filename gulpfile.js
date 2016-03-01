
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

//scripts
var concat = require('gulp-concat');
var minifyJS = require('gulp-uglify');
var jshint = require('gulp-jshint');

//css
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var scsslint = require('gulp-scss-lint');
var autoprefixer = require('gulp-autoprefixer');
var cssbeautify = require('gulp-cssbeautify');

//images
var imagemin = require('gulp-imagemin');
var jpegtran = require('imagemin-jpegtran');
var gm = require('gulp-gm');

//fonts
var cssBase64 = require('gulp-css-base64');

//utility
var rename = require('gulp-rename');
var fileinclude = require('gulp-file-include');

//var copy = require('gulp-copy');
var clean = require('gulp-rimraf');

//var filter = require('gulp-filter');
var stylish = require('jshint-stylish');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');

//svg
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');

//bower
var mainBowerFiles = require('main-bower-files');

// markdown
var markdown = require('gulp-markdown');

// html
var htmltidy = require('gulp-htmltidy');
var htmlmin = require('gulp-html-minifier');

// web server
var webserver = require('gulp-webserver');


var paths = {
  pageTemplates : {
   input : 'source/templates/**/{*.html,*shtml}',
   testing: 'test/',
   dist : 'public/'
  },
  scripts : {
    input : 'source/scripts/*.js',
    exclude : 'source/scripts/exclude/*.js',
    bower : 'bower_components/**/*.js',
    vendor : 'source/scripts/vendor/*.js',
    testing : 'test/scripts/',
    dist : 'public/scripts/'
  },
  bower : {
   components : 'bower_components',
   json : 'bower.json',
   vendor : 'source/scripts/vendor/'
  },
  styles : {
    input : 'source/sass/*.scss',
    exclude : '!source/sass/partials/*scss',
    testing : 'test/css',
    dist : 'public/css',
    watch : 'source/sass/**/*.scss'
  },
  images : {
    input : 'source/photos_in/{*.jpg, *.tiff, *png}',
    output : 'source/photos_out/',
    testing : 'test/siteart/',
    dist : 'public/siteart/'
  },
  svg : {
    input : 'source/svg/SVG_in/*.svg',
    output : 'source/svg/',
  },
  markdown : {
    input: 'source/markdown_in/**/*.md',
    output: 'source/content/'
  },
  html_partials : {
    input: 'source/html_partials/**/*.html',
  },
  data: {
    input: 'source/data/**/*.*',
    output: "test/data/",
    dist: "public/data/"
  },
  appIcons: {
    input: "source/appIcons/**/*.*",
    dist: "public/"
  },
  siteart: {
    input: "source/siteart/*",
    test: "test/siteart/",
    dist: 'public/siteart/'
  },
};

// tasks
// moves page templates from src to testing and dist
gulp.task('templates', function() {
   gulp.src(paths.pageTemplates.input)
   .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(htmltidy({doctype: 'html5',
                  hideComments: false,
                  indent: true}))
   .pipe(gulp.dest(paths.pageTemplates.testing))
   .pipe(htmlmin({collapseWhitespace: true}))
   .pipe(gulp.dest(paths.pageTemplates.dist));
});

// concatenates scripts, but not items in exclude folder. includes vendor folder
gulp.task('concat', function() {
 //   var filterItems = filter(['!' + paths.scripts.exclude, '!' + paths.scripts.bower, '!' + paths.scripts.vendor]);
   gulp.src([paths.scripts.vendor, paths.scripts.input,'!' + paths.scripts.exclude, '!' + paths.scripts.bower])
   .pipe(concat('main.js'))
   .pipe(gulp.dest(paths.scripts.testing))
   .pipe(minifyJS())
   .pipe(gulp.dest(paths.scripts.dist));
});
gulp.task('exclude', function() {
   gulp.src(paths.scripts.exclude)
   .pipe(gulp.dest(paths.scripts.testing))
   .pipe(minifyJS())
   .pipe(gulp.dest(paths.scripts.dist));
});
// lints main javascript file for site
gulp.task('lint', function() {
  return gulp.src('source/scripts/functions.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});
//minifies scripts in the exclude folder and moves unminified to testing and minified to dist
// gulp.task('minifyScripts', function() {
//    gulp.src(paths.scripts.exclude)
//    .pipe(gulp.dest(paths.scripts.testing))
//    .pipe(minifyJS())
//    .pipe(gulp.dest(paths.scripts.dist));
// });
// lints and minifies css, moves to testing and dist
gulp.task('css', function() {
  gulp.src([paths.styles.input, paths.styles.exclude])
  .pipe(scsslint())
   .pipe(sass())
   .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
   }))
   .pipe(cssbeautify({
        indent: '  ',
        openbrace: 'end-of-line',
        autosemicolon: true
    }))
   .pipe(gulp.dest(paths.styles.testing))
    .pipe(minifyCSS({
      keepBreaks:false
    }))
    .pipe(gulp.dest(paths.styles.dist));
});
// creates svg sprite from folder of SVGs and moves it to testing and dist
gulp.task('svg', function () {
    return gulp
        .src(paths.svg.input)
        .pipe(svgmin())
        .pipe(svgstore())
        .pipe(rename ({
            basename: 'svgsprite',
            extname: '.svg'
        }))
        .pipe(gulp.dest(paths.svg.output));
});
// markdown converter
gulp.task('markdown', function () {
    return gulp.src(paths.markdown.input)
        .pipe(markdown())
        .pipe(gulp.dest(paths.markdown.output));
});
// moves bower dependencies to vendor folder
gulp.task('bower', function() {
   return gulp.src(mainBowerFiles({
    paths: {
        bowerDirectory: paths.bower.components,
        bowerJson: paths.bower.json
    }
}))
    .pipe(gulp.dest(paths.bower.vendor))
});
// copies conents of the src siteart folder
gulp.task('siteart', function() {
  return gulp.src(paths.siteart.input)
      .pipe(gulp.dest(paths.siteart.test))
      .pipe(gulp.dest(paths.siteart.dist));
});
// webserver with live reload
gulp.task('webserver', function() {
  gulp.src('test')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      // path:"test/"
    }));
});
// creates blog images in four sizes, minifies, moves to testing and dist
gulp.task('images', function () {

  // Medium images
  gulp.src(paths.images.input)
    .pipe(gm(function (gmfile){
      return gmfile.setFormat('jpg'),
      		 gmfile.resample(72, 72),
             gmfile.thumbnail(450, '265!'),
             gmfile.quality(82),
             gmfile.filter('triangle'),
             gmfile.unsharp('0.25x0.25+8+0.065'),
             gmfile.interlace('none'),
             gmfile.colorspace('sRGB'),
             gmfile.crop(450, 265, 0, 0);
    }, {
      imageMagick: true
    }))

    // Crunches images
    .pipe(imagemin({
      progressive: true,
      use: [jpegtran()]
    }))

    // Renames images
    .pipe(rename({
      prefix: 'med_'
    }))

    .pipe(gulp.dest(paths.images.testing))
    .pipe(gulp.dest(paths.images.dist));

    gulp.src(paths.images.input)
   .pipe(clean())
   .pipe(gulp.dest(paths.images.output));
});

gulp.task('appIcons', function() {
  gulp.src(paths.appIcons.input)
    .pipe(gulp.dest(paths.appIcons.dist));
});

// gulp watches

// Spin up livereload server and listen for file changes
gulp.task('listen', function () {
    // livereload.listen();
    // page templates
    gulp.watch(paths.pageTemplates.input).on('change', function(file) {
      gulp.start('templates');
      // gulp.start('refresh');
    });
    // scripts
      gulp.watch(paths.scripts.input).on('change', function(file) {
      gulp.start('lint');
      gulp.start('concat');
      // gulp.start('refresh');
    });
    // css
      gulp.watch(paths.styles.watch).on('change', function(file) {
      gulp.start('css');
      // gulp.start('refresh');
    });
    // markdown
    gulp.watch(paths.markdown.input).on('change', function(file) {
      gulp.start('markdown');
      gulp.start('templates');
    });
    gulp.watch(paths.html_partials.input).on('change', function(file) {
      gulp.start('templates');
      // gulp.start('refresh');
    });
    gulp.watch(paths.siteart.input).on('change', function(file) {
      gulp.start('siteart');
      // gulp.start('refresh');
    });
    gulp.watch(paths.scripts.exclude).on('change', function(file) {
      gulp.start('exclude');
      // gulp.start('refresh');
    });
});
// // Run livereload after file change
// gulp.task('refresh', function () {
//     livereload.changed();
// });
// Compile files, generate docs, and run unit tests (default)
gulp.task('default', [
	'templates',
	'css',
	'svg',
	'bower',
  'concat',
  'markdown',
  'exclude'
]);
