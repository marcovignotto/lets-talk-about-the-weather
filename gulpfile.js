// init modules
const { src, dest, watch, series, parallel } = require("gulp");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const concat = require("gulp-concat");
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const terser = require("gulp-terser-js");

// file path vars

const filesAdmin = {
  scssPath: "lib/scss/**/*.scss",
  jsPath: "admin/scripts/**/*.js",
};
const filesClient = {
  scssPath: "lib/scss/**/*.scss",
  jsPath: "lib/js/index.js",
  // jsPath: "lib/js/**/*.js",
};

// sass task admin
function scssTaskAdmin() {
  return src(filesAdmin.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("admin/dist"));
}

// sass task client
function scssTaskClient() {
  return src(filesClient.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("lib/dist"));
}

// JS task admin
function jsTaskAdmin() {
  return (
    src(filesAdmin.jsPath)
      .pipe(concat("index.js"))
      // .pipe(
      //   terser({
      //     mangle: {
      //       toplevel: true,
      //     },
      //   })
      // )
      .pipe(dest("admin/dist"))
  );
}

// JS task Client
function jsTaskClient() {
  return (
    src(filesClient.jsPath)
      .pipe(concat("index.js"))
      // .pipe(
      //   terser({
      //     mangle: {
      //       toplevel: true,
      //     },
      //   })
      // )
      .pipe(dest("lib/dist"))
  );
}

// cachebusting admin
const cbString = new Date().getTime();
function cacheBustTask() {
  return src(["admin/dist/index.html"])
    .pipe(replace(/cb=\d+/g, "cb=" + cbString))
    .pipe(dest("."));
}

// watch task admin
function watchTaskAdmin() {
  watch(
    [filesAdmin.scssPath, filesAdmin.jsPath],
    parallel(scssTaskAdmin, jsTaskAdmin)
  );
}

// watch task client
function watchTaskAll() {
  watch(
    [
      filesAdmin.scssPath,
      filesAdmin.jsPath,
      filesClient.scssPath,
      filesClient.jsPath,
    ],
    parallel(scssTaskAdmin, jsTaskAdmin, scssTaskClient, jsTaskClient)
  );
}

// default task

exports.default = series(
  parallel(scssTaskAdmin, jsTaskAdmin),
  parallel(scssTaskClient, jsTaskClient),
  cacheBustTask,
  // watchTaskAdmin,
  watchTaskAll
);
