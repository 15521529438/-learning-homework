// var gulp = require('gulp');

// gulp.task('default', function() {
//   // 将你的默认的任务代码放在这
// });


var gulp = require('gulp'),
    babel = require('gulp-babel'),
    rename = require('gulp-rename');

gulp.task('taskKOA2', function(){
    gulp.src('node_modules/koa/lib/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename({suffix: 'build_es6'}))
        .pipe(gulp.dest('koa2build/koa2build_ES6'));
});

gulp.task('startWatch', function(){
    gulp.watch('node_modules/koa/lib/*.js', ['taskKOA2']);
});