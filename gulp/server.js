var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('dev:server', function () {
    nodemon({
        script: 'app.js',
        ext: 'js',
        ignore: ['assets*', 'gulp*', 'node_modules*']
    })
});