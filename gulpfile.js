var gulp  = require('gulp'),
    gutil = require('gulp-util')
    sourcemaps = require('gulp-sourcemaps'),
    streamqueue = require('streamqueue'),
    pump = require('pump')
    rollup = require('gulp-better-rollup'),
    buble = require('rollup-plugin-buble'),
    resolve = require('rollup-plugin-node-resolve'),
    buble = require('rollup-plugin-buble'),
    concat = require('gulp-concat'),
    stripDebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    ejs = require('gulp-ejs'),
    rename = require('gulp-rename'),
    htmlclean = require('gulp-htmlclean'),
    cssnano = require('gulp-cssnano'),
    browserSync = require('browser-sync').create(),
    ifElse = require('gulp-if-else'),
    //vueify = require('gulp-vueify'),
    newer = require('gulp-newer'),
    //vue = require('rollup-plugin-vue2'),
    vue = require('rollup-plugin-vue'),
    commonJs = require('rollup-plugin-commonjs'),
    //css = require('rollup-plugin-css-only'),
    //babel = require('rollup-plugin-babel'),
    nodent = require('rollup-plugin-nodent')
    ;

var buildEnv = process.env.ENV || "prod",
    buildPlatform = process.env.PLATFORM || "browser";

const isProd = buildEnv == "prod",
    destDir = 'dist/'+buildPlatform+'/'+buildEnv,
    stagingDir = 'staging/'+buildPlatform+'/'+buildEnv,
    stylesCss = (isProd) ? 'css/styles.min.css' : 'css/styles.css',
    mainJs = (isProd) ? 'js/main.min.js' : 'js/main.js';

gutil.log(gutil.colors.bgBlue(gutil.colors.yellow("ENV: "+buildEnv+" - PLATFORM: "+buildPlatform)));


gulp.task('default', function() {
    return gutil.log('gulp: default task empty');
});

gulp.task('css-style', function(cb) {
    pump([
        gulp.src('src/css/style.css'),
        ifElse(isProd, () => sourcemaps.init()),
        concat((isProd) ? 'styles.min.css' : 'styles.css' ),
        ifElse(isProd, () => cssnano()),
        ifElse(isProd, () => sourcemaps.write('.')),
        gulp.dest(destDir+'/css'),
        browserSync.stream()
    ], cb);
});

gulp.task('index', function(cb) {
    pump([
        gulp.src('src/index.ejs.html'),
        ejs({ stylesCss: stylesCss, mainJs: mainJs }),
        ifElse(isProd, () => htmlclean()),
        rename("index.html"),
        gulp.dest(destDir),
        browserSync.stream()
    ], cb);
});

// gulp.task('vue', function (cb) {
//     pump([
//         gulp.src('src/vue/**/*.vue'),
//         newer(stagingDir+'/vue'),
//         vueify(),
//         gulp.dest(stagingDir+'/vue')
//     ], cb);
// });

gulp.task('js-main', function(cb) {
    pump([
        /*streamqueue({ objectMode: true },
            //gulp.src(platformJs).pipe(ejs({ buildEnv: buildEnv, buildPlatform: buildPlatform })),
            gulp.src('src/js/app.js')
        ),*/
        gulp.src('src/js/main.js'),
        ifElse(isProd, () => sourcemaps.init()),
        rollup({
            //treeshake: false,
            sourceMap: true,
            //external: ['vue'],
            plugins: [
                vue({
                    compileTemplate: true,
                    htmlMinifier: {
                        collapseWhitespace: false,
                        removeComments: false
                    },
                    css: destDir+'/css/bundle.css'}),
                //css(),
                buble(),
                resolve({ browser: true, jsnext: true, main: true }),
                commonJs(),
                /*babel({
                    //plugins: ['external-helpers'],
                    //externalHelpers: true,
                    exclude: 'node_modules/**'
                    }),*/
                nodent(/*{ sourcemap: true }*/),
            ]}, { format: 'iife' }),
        concat((isProd) ? 'main.min.js' : 'main.js'),
        //ifElse(isProd, () => stripDebug()),
        ifElse(isProd, () => uglify()),
        ifElse(isProd, () => sourcemaps.write('')),
        gulp.dest(destDir+'/js'),
        browserSync.stream()
    ], cb);
});

// Static server
/*gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: destDir
        }
    });
});*/

gulp.task('build', ['index', 'css-style', 'js-main'], function() {

});

gulp.task('watch', function() {
    gulp.watch("src/index.ejs.html", ['index']);
    gulp.watch("src/css/**/*.css", ['css-style']);
    gulp.watch(["src/js/**/*.js", "src/vue/**/*.vue"], ['js-main']);
});

gulp.task('serve', ['index', 'css-style', 'js-main'], function() {
    browserSync.init({
        server: destDir
    });
    gulp.watch("src/index.ejs.html", ['index']);
    gulp.watch("src/css/**/*.css", ['css-style']);
    gulp.watch(["src/js/**/*.js", "src/vue/**/*.vue"], ['js-main']);
    //gulp.watch("src/vue/**/*.vue", ['vue']);
    gulp.watch([destDir+'/index.html', destDir+'/js/**/*.js', destDir+'/css/**/*.css'])
        .on('change', browserSync.reload);
});
