// init modules
const { src, dest, watch, series, parallel } = require("gulp");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const concat = require("gulp-concat");
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");

// file path vars

const files = {
  scssPath: "lib/scss/**/*.scss",
  jsPath: "admin/scripts/**/*.js",
};

// sass task
function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("admin/dist"));
}

// JS task

function jsTask() {
  return src(files.jsPath)
    .pipe(concat("index.js"))
    .pipe(uglify())
    .pipe(dest("admin/dist"));
}

// cachebusting
const cbString = new Date().getTime();
function cacheBustTask() {
  return src(["admin/dist/index.html"])
    .pipe(replace(/cb=\d+/g, "cb=" + cbString))
    .pipe(dest("."));
}

// watch task
function watchTask() {
  watch([files.scssPath, files.jsPath], parallel(scssTask, jsTask));
}

// default task

exports.default = series(parallel(scssTask, jsTask), cacheBustTask, watchTask);
