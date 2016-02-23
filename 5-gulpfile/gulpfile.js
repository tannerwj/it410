const gulp = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const htmlmin = require('gulp-htmlmin')
const imagemin = require('gulp-imagemin')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')
const useref = require('gulp-useref')
const rename = require('gulp-rename')
const jpegtran = require('imagemin-jpegtran')
const changed = require('gulp-changed')

gulp.task('sass', function () {
	return gulp.src('./sass/**/*.scss')
		.pipe(changed('dist'))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(csso())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist'))
})

gulp.task('autoprefixer', function () {
	return gulp.src(['src/*.css', 'src/**/*.css'])
		.pipe(changed('dist'))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(csso())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist'))
})

gulp.task('compress-js', function() {
	return gulp.src(['src/*.js', 'src/**/*.js'])
		.pipe(changed('dist'))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist'))
})

gulp.task('compress-html', ['compress-js', 'autoprefixer', 'sass'], function() {
	return gulp.src(['src/*.html', 'src/**/*.html'])
		.pipe(changed('dist'))
		.pipe(htmlmin())
		.pipe(useref())
		.pipe(gulp.dest('dist'))
})

gulp.task('compress-img', function() {
	return gulp.src(['src/*.jpg', 'src/**/*.jpg'])
		.pipe(changed('dist/images'))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [jpegtran()]
		}))
		.pipe(gulp.dest('dist/images'))
})

gulp.task('watch', function () {
	gulp.watch(['src/*.jpg', 'src/**/*.jpg'], ['compress-img'])
	gulp.watch(['src/*.js', 'src/**/*.js'], ['compress-js'])
	gulp.watch(['src/*.html', 'src/**/*.html'], ['compress-html'])
	gulp.watch(['src/*.css', 'src/**/*.css'], ['autoprefixer'])
	gulp.watch('./sass/**/*.scss', ['sass'])
})

gulp.task('default', ['compress-html', 'compress-img'], function() {
	console.log('gulped everything')
})
