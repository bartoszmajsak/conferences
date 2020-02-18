var pkg = require('./package.json'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  plumber = require('gulp-plumber'),
  del = require('del'),
  rimraf = require('gulp-rimraf'),
  rename = require('gulp-rename'),
  connect = require('gulp-connect'),
  browserify = require('gulp-browserify'),
  uglify = require('gulp-uglify'),
  jade = require('gulp-jade'),
  stylus = require('gulp-stylus'),
  autoprefixer = require('gulp-autoprefixer'),
  csso = require('gulp-csso'),
  through = require('through'),
  open = require('open'),
  ghpages = require('gh-pages'),
  path = require('path'),
  pdf = require('bespoke-pdf'),
  rimraf = require('gulp-rimraf'),
  isDist = process.argv.indexOf('serve') === -1;

gulp.task('js', ['clean:js'], function() {
  gulp.src(['src/scripts/demo.json', 'src/scripts/asciinema-player.js']).pipe(gulp.dest('dist/build'));

  return gulp.src(['src/scripts/main.js'])
    .pipe(isDist ? through() : plumber())
    .pipe(browserify({ transform: ['debowerify'], debug: !isDist }))
    .pipe(isDist ? uglify() : through())
    .pipe(rename('build.js'))
    .pipe(gulp.dest('dist/build'))
    .pipe(connect.reload());
});

gulp.task('html', ['clean:html'], function() {
  return gulp.src('src/index.jade')
    .pipe(isDist ? through() : plumber())
    .pipe(jade({ pretty: true }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('css', ['clean:css'], function() {
  gulp.src('src/styles/asciinema-player.css').pipe(gulp.dest('dist/build'));

  return gulp.src('src/styles/main.styl')
    .pipe(isDist ? through() : plumber())
    .pipe(stylus({
      // Allow CSS to be imported from bower_components
      'include css': true,
      'paths': ['./node_modules', './bower_components']
    }))
    .pipe(autoprefixer('last 2 versions', { map: false }))
    .pipe(isDist ? csso() : through())
    .pipe(rename('build.css'))
    .pipe(gulp.dest('dist/build'))
    .pipe(connect.reload());
});

gulp.task('fonts', ['clean:fonts'], function() {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(connect.reload());
});

gulp.task('images', ['clean:images'], function() {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('dist/images'))
    .pipe(connect.reload());
});

gulp.task('demo', ['clean:demo'], function() {
  return gulp.src('src/demo/**/*')
    .pipe(gulp.dest('dist/demo'))
    .pipe(connect.reload());
});


gulp.task('clean', function() {
  return gulp.src('dist')
    .pipe(rimraf());
});

gulp.task('clean:html', function() {
  return gulp.src('dist/index.html')
    .pipe(rimraf());
});

gulp.task('clean:js', function() {
  return gulp.src('dist/build/build.js')
    .pipe(rimraf());
});

gulp.task('clean:css', function() {
  return gulp.src('dist/build/build.css')
    .pipe(rimraf());
});

gulp.task('clean:fonts', function() {
  return del('dist/fonts');
});

gulp.task('clean:images', function() {
  return gulp.src('dist/images')
    .pipe(rimraf());
});

gulp.task('clean:demo', function() {
  return gulp.src('dist/demo')
    .pipe(rimraf());
});

gulp.task('connect', ['build'], function(done) {
  var port = 8888;
  connect.server({
    root: 'dist',
    port: port,
    livereload: true
  });

  open('http://localhost:' + port, done);
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.jade', ['html']);
  gulp.watch('src/styles/**/*.styl', ['css']);
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch('src/fonts/*', ['fonts']);
  gulp.watch('src/demo/*', ['demo']);
  gulp.watch([
    'src/scripts/**/*.js',
    'bespoke-theme-*/dist/*.js' // Allow themes to be developed in parallel
  ], ['js']);
});

gulp.task('deploy', ['build'], function(done) {
  ghpages.publish(path.join(__dirname, 'dist'), { logger: gutil.log, message: 'Updates --skip-ci' }, done);
});

gulp.task('pdf', ['connect'], function () {
  return pdf(pkg.name + '.pdf')
    .pipe(gulp.dest('dist'));
});

gulp.task('clean:pdf', function() {
  return gulp.src('dist/' + pkg.name + '.pdf')
    .pipe(rimraf());
});

gulp.task('present', ['build'], function(done) {
  let onstage = path.join(__dirname, 'onstage.html')
  let index = path.join(__dirname, 'dist', 'index.html')
  open('file://' + onstage + '#' + index, done);
});

gulp.task('build', ['js', 'html', 'css', 'fonts', 'images', 'demo']);
gulp.task('serve', ['connect', 'watch']);
gulp.task('default', ['build']);
