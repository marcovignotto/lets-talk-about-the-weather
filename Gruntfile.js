module.exports = function (grunt) {
  grunt.initConfig({
    concat: {
      js: {
        src: ["lib/js/**/*.js", "lib/dist/scripts/**/*.js"],
        dest: "lib/dist/scripts.js",
      },
      // css: {
      //   src: ["css/*.css"],
      //   dest: "lib/dist/main.css",
      // },
    },
    watch: {
      js: {
        files: ["lib/js/**/*.js"],
        tasks: ["concat"],
      },
    },
  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["concat", "watch"]);
};
