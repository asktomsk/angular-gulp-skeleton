'use strict';

var args            = require('yargs').argv,
    express         = require('express'),
    compression     = require('compression'),
    gulp            = require('gulp'),
    gulpif          = require('gulp-if'),
    stylus          = require('gulp-stylus'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),
    uglifycss       = require('gulp-uglifycss'),
    replace         = require('gulp-replace'),
    prefix          = require('gulp-autoprefixer'),
    ngTemplate      = require('gulp-ng-template'),
    minifyHtml      = require('gulp-minify-html'),
    watch           = require('gulp-watch'),
    livereload      = require('gulp-livereload'),
    runSequence     = require('run-sequence'),
    streamqueue     = require('streamqueue'),
    nib             = require('nib'),
    getVendorHash   = require('./utils/get-vendor-hash'),
    config          = require('./config.js');

/**
 * Settings
 */
var serverPort      = args.PORT || 5000,
    buildNumber     = args.buildNumber || 0,
    vendorHash      = getVendorHash(config.vendors);

/**
 * Gulp tasks
 */
// Compile variables
gulp.task('vars', function () {
    var reps = config.indexReplaces,
        names = config.assetsNames;

    reps.style.to = reps.style.to.replace(
        config.compile.buildNumberTemplate, buildNumber);

    reps.scriptVendor.to = reps.scriptVendor.to.replace(
        config.compile.vendorHashTemplate, vendorHash);

    reps.scriptApp.to = reps.scriptApp.to.replace(
        config.compile.buildNumberTemplate, buildNumber);

    reps.scriptTemplate.to = reps.scriptTemplate.to.replace(
        config.compile.buildNumberTemplate, buildNumber);

    names.styles = names.styles.replace(
        config.compile.buildNumberTemplate, buildNumber);

    names.scriptVendor = names.scriptVendor.replace(
        config.compile.vendorHashTemplate, vendorHash);

    names.scriptApp = names.scriptApp.replace(
        config.compile.buildNumberTemplate, buildNumber);

    names.templates = names.templates.replace(
        config.compile.buildNumberTemplate, buildNumber);
});

// Stylus
gulp.task('stylus', function () {
    return gulp.src(config.srcPaths.indexStylus)
        .on('error', function (err) {
            console.log(err.message);
            this.end();
        })
        .pipe(stylus({ use: nib(), compress: true })) 
        .pipe(prefix())
        .pipe(concat(config.assetsNames.styles))
        .pipe(gulp.dest(config.distPaths.styles))
        .pipe(gulpif(config.compile.isLiveReload, livereload()));
});

// Angular HTML templates
gulp.task('templates', function () {
    return gulp.src(config.srcPaths.templates)
        .pipe(minifyHtml({
            empty:          true, 
            cdata:          true,
            comments:       true,
            conditionals:   true,
            spare:          true,
            quotes:         true,
            loose:          true
        }))
        .pipe(ngTemplate({
          moduleName:   config.templates.moduleName,
          standalone:   true,
          filePath:     config.assetsNames.templates,
          prefix:       config.templates.prefix
        }))
        .pipe(gulp.dest(config.distPaths.templates))
        .pipe(gulpif(config.compile.isLiveReload, livereload()));
});

// JS
gulp.task('js', function (callback) {
    runSequence(
        'js-main-vendor',
        'js-main-app',
        'js-index',
        callback);
});

gulp.task('js-main-vendor', function () {
    var sources = config.vendors.map(function (path) {
        return gulp.src(path);
    });

    return streamqueue.apply(this, [].concat({ objectMode: true }, sources))
        .pipe(concat(config.assetsNames.scriptVendor))
        .pipe(gulp.dest(config.distPaths.scripts))
        .pipe(gulpif(config.compile.isLiveReload, livereload()));
});

gulp.task('js-main-app', function () {
    return gulp.src(config.srcPaths.appJs)
        .pipe(concat(config.assetsNames.scriptApp))
        .pipe(gulp.dest(config.distPaths.scripts))
        .pipe(gulpif(config.compile.isLiveReload, livereload()));
});

gulp.task('js-index', function () {
    var reps = config.indexReplaces;

    return gulp.src(config.srcPaths.index)
        .pipe(replace(reps.style.from,          reps.style.to))
        .pipe(replace(reps.scriptVendor.from,   reps.scriptVendor.to))
        .pipe(replace(reps.scriptApp.from,      reps.scriptApp.to))
        .pipe(replace(reps.scriptTemplate.from, reps.scriptTemplate.to))
        .pipe(gulpif(
            config.compile.isLiveReload,
            replace(reps.livereload.from,       reps.livereload.to)))
        .pipe(gulp.dest(config.distPaths.dist));
});

// Minification
gulp.task('uglify', function (callback) {
    runSequence(
        'uglify-script-vendor',
        'uglify-script-app',
        'uglify-style',
        callback);
});

gulp.task('uglify-script-vendor', function () {
    var sourcePath = config.distPaths.scripts + config.assetsNames.scriptVendor;

    return gulp.src(sourcePath)
        .pipe(uglify({ mangle: true }))
        .pipe(gulp.dest(config.distPaths.scripts));
});

gulp.task('uglify-script-app', function () {
    var sourcePath = config.distPaths.scripts + config.assetsNames.scriptApp;

    return gulp.src(sourcePath)
        .pipe(uglify({ mangle: true }))
        .pipe(gulp.dest(config.distPaths.scripts));
});

gulp.task('uglify-style', function () {
    var sourcePath = config.distPaths.styles + config.assetsNames.styles;

    return gulp.src(sourcePath)
        .pipe(uglifycss())
        .pipe(gulp.dest(config.distPaths.dist));
});

// Live reload watcher
gulp.task('watch', function (callback) {
    gulp.watch(config.vendors,              ['js']);
    gulp.watch(config.srcPaths.appJs,       ['js']);
    gulp.watch(config.srcPaths.allStylus,   ['stylus']);
    gulp.watch(config.srcPaths.templates,   ['templates']);

    callback();
});

// Dev server runner
gulp.task('run_dev_server', function (callback) {

    // Start express server
    var server = express();
    server.use(compression());
    server.use(express.static('./' + config.distPaths.dist));
    server.all('/*', function (req, res) {
       res.sendFile('index.html', { root: config.distPaths.dist });
    });

    server.listen(serverPort);

    livereload.listen({
        host: config.compile.liveReloadHost,
        port: config.compile.liveReloadPort
    });

    callback();
});

/**
 * Executable tasks
 */
// development server
gulp.task('dev', function (callback) {
    config.compile.isLiveReload = true;

    runSequence('vars', 'stylus', 'templates', 'js', 'run_dev_server', 'watch', 
        callback);
});

// builds for release
gulp.task('release', function (callback) {
    runSequence('vars', 'stylus', 'templates', 'js', 'uglify', callback);
});