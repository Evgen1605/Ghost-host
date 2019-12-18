const gulp = require('gulp');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const concat = require('gulp-concat');
const cleanCss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();

const config = {
  paths: {
    scss: './src/scss/**/*.scss',
    html: './public/index.html'
  },
  output: {
    cssName: 'bundle.min.css',
    path: './public'
  },
  isDevelop: false
}

gulp.task('scss', function () {
  return gulp.src(config.paths.scss)
    .pipe(plumber())
    .pipe(gulpIf(config.isDevelop, sourceMaps.init()))
    .pipe(sass())
    .pipe(concat(config.output.cssName))
    .pipe(autoprefixer())
    .pipe(gulpIf(!config.isDevelop, cleanCss()))
    .pipe(gulpIf(config.isDevelop, sourceMaps.write()))
    .pipe(gulp.dest(config.output.path))
    .pipe(browserSync.stream());
});

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: config.output.path
    }
  });

  gulp.watch(config.paths.scss, ['scss']);
  gulp.watch(config.paths.html).on('change', browserSync.reload);
});

gulp.task('default', ['scss', 'serve']);

