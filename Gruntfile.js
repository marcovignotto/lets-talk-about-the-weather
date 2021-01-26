module.exports = function (grunt) {
  grunt.initConfig({
    strip_code: {
      options: {
        blocks: [
          {
            start_block: "/* start-test-block */",
            end_block: "/* end-test-block */",
          },
          {
            start_block: "<!-- start-html-test-code -->",
            end_block: "<!-- end-html-test-code -->",
          },
        ],
      },
      your_target: {
        src: ["lib/js/**/*.js"],
      },
    },
    concat: {
      js: {
        // src: ["lib/js/**/*.js", "lib/dist/scripts/**/*.js"],
        src: ["lib/js/**/*.js"],
        dest: "lib/dist/scripts/scripts.js",
      },
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
