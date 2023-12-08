const {src, dest, watch, parallel} = require("gulp");

// CSS
const sass = require(`gulp-sass`)(require(`sass`));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");

// Imagenes
const cache = require ('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require ('gulp-avif');

// JavaScript
const terser = require('gulp-terser-js');


function css(done) {

    src(`src/scss/**/*.scss`)            // Identificar el archivo en SASS
        .pipe( plumber() )
        .pipe(sourcemaps.init())
        .pipe( sass() )                  // Compilarlo
        .pipe( postcss([autoprefixer(), cssnano() ]) )
        .pipe( sourcemaps.write('.'))
        .pipe( dest(`build/css`) );      // Almacenarla en el disco duro

    done();                             // Callback que avisa a gulp cuando llegamos al final
}

function imagenes(done) {
    const opciones = {
        optimizationLevel: 3
    }

    src('src/img/**/*.{jpg,png} ')
        .pipe(cache( imagemin(opciones)) )
        .pipe( dest('build/img') )

    done();
}

function versionWebp( done) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{jpg,png} ')
        .pipe(webp(opciones))
        .pipe( dest('build/img') )
    done();
}

function versionAvif( done) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{jpg,png} ')
        .pipe( avif(opciones) )
        .pipe( dest('build/img') )
    done();
}

function javascript(done) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe( terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest ('build/js'))

    done();
}

function dev(done) {
    watch(`src/scss/**/*.scss`, css)
    watch('src/js/**/*.js', javascript)
    
    done();
}

exports.css = css;
exports.javascript = javascript;
exports.imagenes = imagenes;
exports.versionAvif = versionAvif;
exports.versionWebp = versionWebp;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);