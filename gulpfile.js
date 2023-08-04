const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass')(require('sass'));
const autoPrefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const ggcmq = require('gulp-group-css-media-queries');
const sassGlob = require('gulp-sass-glob');
const pug = require('gulp-pug');
const imagemin = require('gulp-imagemin');
const del = require('del');

// Таск для компиляции pug в html
gulp.task('pug', function() {
	return gulp.src('./src/pug/pages/*.pug')
        .pipe( plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: 'Pug',
                    sound: false,
                    message: err.message
                }
            })
        }) )      
		.pipe( pug({
            pretty: true
        }) )       
		.pipe( gulp.dest('./build/') )	
        .pipe( browserSync.stream() )        
});


// Таск для компиляции SCSS в CSS
gulp.task('scss', function() {
	return gulp.src('./src/scss/main.scss')
        .pipe( plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: 'Styles',
                    sound: false,
                    message: err.message
                }
            })
        }) )
        .pipe( sourcemaps.init() )
        .pipe( sassGlob() )
		.pipe( sass({
            indentType: 'tab',
            indentWidth: 1,
            outputStyle: 'expanded'
        }) )
        .pipe( ggcmq() )
        .pipe(autoPrefixer({
            overrideBrowserslist: ['last 4 versions']
        }))
        .pipe( sourcemaps.write() )
		.pipe( gulp.dest('./build/css/') )
        .pipe( browserSync.stream() );	
});

gulp.task('copy:img', function() {
    return gulp.src('./src/img/**/*.*')
        .pipe( imagemin() )
        .pipe( gulp.dest('./build/img/') )
});

gulp.task('copy:js', function() {
    return gulp.src('./src/js/**/*.*')
        .pipe( gulp.dest('./build/js/') )
});

gulp.task('copy:font', function() {
    return gulp.src('./src/fonts/**/*.*')
        .pipe( gulp.dest('./build/fonts/') )
});

gulp.task('watch', function() { 
    watch(['./src/js/**/*.*', './src/img/**/*.*'], gulp.parallel( browserSync.reload ));
    
    watch('./src/scss/**/*.scss', function(){
        setTimeout( gulp.parallel('scss'), 1000 );
    });

    watch('./src/pug/**/*.pug', gulp.parallel( 'pug' ));  
    watch('./src/img/**/*.*', gulp.parallel( 'copy:img' ));  
    watch('./src/js/**/*.*', gulp.parallel( 'copy:js' ));  
    watch('./src/fonts/**/*.*', gulp.parallel( 'copy:font' ));  
});

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
});

gulp.task('del', function(cb) {
    return del('./build');
    cb();
});


gulp.task( 'default', 
        gulp.series( 
            gulp.parallel('del'),
            gulp.parallel('scss', 'pug', 'copy:img', 'copy:js', 'copy:font'), 
            gulp.parallel('server', 'watch') 
        ) 
);