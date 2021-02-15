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
    .pipe(
      terser({
        mangle: {
          toplevel: true,
        },
      })
    )
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

// const gulp = require("gulp");
// const concat = require("gulp-concat");
// const sourcemaps = require("gulp-sourcemaps");
// const terser = require("gulp-terser-js");

// const sourceMapOpt = {
//   sourceMappingURL: (file) => "http://127.0.0.1/map/" + file.relative + ".map",
// };
// const mapsFolder = "./public/map";

// const minifyJS = () =>
//   gulp
//     .src("./asset/js/*.js")
//     .pipe(gulp.dest(mapsFolder))
//     .pipe(sourcemaps.init())
//     .pipe(concat("script.js"))
//     .pipe(
//       terser({
//         mangle: {
//           toplevel: true,
//         },
//       })
//     )
//     .on("error", function (error) {
//       if (error.plugin !== "gulp-terser-js") {
//         console.log(error.message);
//       }
//       this.emit("end");
//     })
//     .pipe(sourcemaps.write(mapsFolder, sourceMapOpt))
//     .pipe(gulp.dest("./public/js/"));

// gulp.task("minifyJS", minifyJS);
