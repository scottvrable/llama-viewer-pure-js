"use strict";

var gulp 		     = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"),
    uglify       = require("gulp-uglify"),
    sourcemaps   = require("gulp-sourcemaps"),
    concat       = require("gulp-concat"),
    sass         = require("gulp-sass"),
    htmlmin      = require("gulp-htmlmin"),
    del          = require("del");

gulp.task("html-min", function() {
  return gulp.src("src/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build/"))
});

gulp.task("sass", function () {
 return gulp.src("src/**/*.scss")
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
  .pipe(autoprefixer("last 10 versions"))
  .pipe(sourcemaps.write())
  .pipe(concat("main.css"))
  .pipe(gulp.dest("build/css"));
});

gulp.task("uglify", function() {
  return gulp.src("src/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("build/js"));
});

gulp.task("clean", function() {
   return del(["build/*.html", "build/css", "build/js"]);
});

gulp.task("default", ["clean"], function() {
	gulp.start("html-min", "sass", "uglify");
	gulp.watch("src/*.html", ["html-min"]);
	gulp.watch("src/**/*.scss", ["sass"]);
	gulp.watch("src/**/*.js", ["uglify"]);
});
