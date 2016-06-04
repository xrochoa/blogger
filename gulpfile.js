'use strict';

/*----------  GULP  ----------*/

var gulp = require('gulp');

/*----------  PLUGINS  ----------*/

//img
var imagemin = require('gulp-imagemin');

//html
var htmlmin = require('gulp-htmlmin');

//css
var sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css');

//js
var jshint = require('gulp-jshint'),
    include = require('gulp-include'),
    //ngAnnotate = require('gulp-ng-annotate'), //for angular apps
    uglify = require('gulp-uglify');

//utils
var del = require('del'),
    runSequence = require('run-sequence'),
    sourcemaps = require('gulp-sourcemaps');


//server
var nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload');

/*----------  CLEAN  ----------*/

//Clean dist folder before tasks
gulp.task('clean', function() {
    return del(['dist/*']);
});

/*----------  RESOURCES  ----------*/

//Copy files from resources
gulp.task('res', function() {
    return gulp.src('src/assets/res/**/*')
        .pipe(gulp.dest('dist/assets/res'))
        .pipe(livereload());
});

/*----------  HTML  ----------*/

//Minify html
gulp.task('html', function() {
    return gulp.src('src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
});

/*----------  IMAGES  ----------*/

//Minify png, jpg, gif and svg images
gulp.task('img', function() {
    return gulp.src('src/assets/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(livereload());
});

/*----------  JAVASCRIPT  ----------*/

//Concat and minify custom js
gulp.task('js', function() {
    return gulp.src('src/assets/js/**/app.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(sourcemaps.init())
        .pipe(include())
        .pipe(ngAnnotate()) //for angular apps
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(livereload());
});

/*----------  CSS  ----------*/

//Compile scss to css and minify
gulp.task('css', function() {
    return gulp.src('src/assets/scss/**/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: [
                "Android 2.3",
                "Android >= 4",
                "Chrome >= 20",
                "Firefox >= 24",
                "Explorer >= 8",
                "iOS >= 6",
                "Opera >= 12",
                "Safari >= 6"
            ],
            cascade: false
        }))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(livereload());
});

/*----------  SERVER  ----------*/

//Node server start
gulp.task('server', function() {
    nodemon({
        script: 'server.js'
    });
});

/*----------  WATCH  ----------*/

//Watches Files For Changes
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/assets/res/**/*', ['res']);
    gulp.watch('src/assets/img/**/*', ['img']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/assets/scss/**/*.scss', ['css']);
    gulp.watch('src/assets/js/**/*.js', ['js']);

});

/*----------  DEFAULT  ----------*/

// Default Task
gulp.task('default', function() {
    runSequence('clean', 'res', 'img', 'html', 'css', 'js', 'watch', 'server');
});