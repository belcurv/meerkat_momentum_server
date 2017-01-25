// gulpfile.js

var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    gutil  = require('gulp-util');

// scripts paths
var inputJsFiles  = 'public/js/**/*.js',
    outputJsFiles = 'public/dist/scripts';


// main task
gulp.task('scripts', function() {
    return gulp.src(inputJsFiles)
        .pipe(concat('momentum.js'))
        .pipe(gulp.dest(outputJsFiles))
        .pipe(rename('momentum.min.js'))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest(outputJsFiles));
});
