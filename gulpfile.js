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
var browserSync1 = require("browser-sync").create();
var browserSync2 = require("browser-sync").create();

// file path vars

const filesAdmin = {
  scssPath: "admin/scss/**/*.scss",
  jsPath: "admin/js/**/*.js",
};
const filesClient = {
  scssPath: "lib/scss/**/*.scss",
  jsPath: "lib/js/all.js",
};

// sass task admin
function scssTaskAdmin() {
  return src(filesAdmin.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("admin/dist/css"));
}

// sass task client
function scssTaskClient() {
  return src(filesClient.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("lib/dist/css"));
}

// JS task admin
function jsTaskAdmin() {
  return (
    src(filesAdmin.jsPath)
      .pipe(concat("scripts/index.js"))
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
      .pipe(concat("scripts/index.js"))
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

// watch task client
function watchTaskAll() {
  browserSync1.init({
    files: ["admin/dist/css/*.css", "admin/dist/scripts/*.js"],
    port: 8080,
    uiPort: 8081,
    notify: false,
    reloadOnRestart: true,
    https: false,
    server: {
      baseDir: "-",
      routes: {
        "/admin": "./admin/dist",
      },
    },
    startPath: "./admin/",
    watch: true,
  });
  browserSync2.init({
    files: ["lib/dist/css/*.css", "lib/dist/scripts/*.js"],
    port: 8090,
    uiPort: 8091,
    notify: false,
    reloadOnRestart: true,
    https: false,
    server: {
      baseDir: "-",
      routes: {
        "/": "./lib/dist",
      },
    },
    startPath: "./",
    watch: true,
  });
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
  watchTaskAll
);
