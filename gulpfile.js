const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const browserSync = require('browser-sync').create();
const minify = require('gulp-minify');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;
const babel = require('gulp-babel');

// CSS Tasks

gulp.task('css-compile', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass({
      outputStyle: 'nested'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 10 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('css-minify', function () {
  return gulp.src(['./dist/css/*.css', '!./dist/css/*.min.css', ])
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/css'));
});

// JS Tasks

gulp.task('js-minify', function () {
  return gulp.src(['./js/**/*.js'])
    .pipe(minify({
      ext: {
        // src:'.js',
        min: '.min.js'
      },
      noSource: true,
    }))
    .pipe(gulp.dest('./dist/js'));
});

// JS BABEL

gulp.task('babel', () =>
  gulp.src('./js/**/*.js')
  .pipe(babel({
    presets: ['@babel/preset-env']
  }))
  .pipe(gulp.dest('./dist/js'))
);

// JS UGLIFY

gulp.task('compress', function () {
  return pipeline(
    gulp.src('./dist/js'),
    uglify(),
    gulp.dest('./dist/js')
  );
});

// Image Compression

gulp.task('img-compression', function () {
  return gulp.src('./img/**/*')
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest('./dist/img'));
});

// Live Server

function liveServer() {
  browserSync.init({
    server: {
      baseDir: './dist',
      directory: true
    },
    notify: false
  });

  // gulp.watch('./**/*', {
  //   cwd: './dist/'
  // }, browserSync.reload);
};
//Live Server Reload
function reload(done) {
  browserSync.reload();
  done();
}

// Build dist

gulp.task('html', () => {
  return gulp.src('./*.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('js', () => {
  return gulp.src(['./js/**/*.js'])
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('build', gulp.series(['html', 'js', 'css-compile', 'css-minify', 'js-minify', 'img-compression', ]))

// Watch

gulp.task('default', function () {
  gulp.watch('./*.html', gulp.series(['html'], reload))
  gulp.watch('./scss/**/*.scss', gulp.series(['css-compile']));
  gulp.watch(['./dist/css/*.css', '!dist/css/*.min.css'], gulp.series(['css-minify'], reload));
  gulp.watch('./js/**/*.js', gulp.series(['js']))
  gulp.watch(['./js/*.js', '!./js/*.min.js'], gulp.series(['js-minify'], reload));
  gulp.watch('**/*', {
    cwd: './img/'
  }, gulp.series(['img-compression'], reload));
  return liveServer();
});