/*global module:false*/
module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ["lib/header.js", "lib/config.js", "lib/level.js", "lib/footer.js"],
        dest: 'dist/setup.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          ' *  <%= pkg.homepage %>\n' +
          ' *  Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
          ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n'
      },
      dist: {
        files: {
          'dist/setup.min.js': ['dist/setup.js']
        }
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    exec: {
      api_styles: {
        cmd: "./node_modules/stylus/bin/stylus < ./extra/doc/api-styles.styl > ./docs/api-styles.css"
      },

      api_docs: {
        cmd: "./node_modules/jade/bin/jade ./extra/doc/index.jade -o ./docs"
      },

      // Until grunt docco works again...
      docco: {
        cmd: "./node_modules/docco/bin/docco -o ./docs lib/quintus*.js examples/*/*.js examples/*/javascripts/*.js"
      },

      gzip: {
        cmd: [
          "gzip dist/setup.js",
          "mv dist/setup.js.gz dist/setup.js",
          "gzip dist/setup.min.js",
          "mv dist/setup.min.js.gz dist/setup.min.js"
          ].join("&&")
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {}
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint','concat:dist','uglify:dist']);
  grunt.registerTask("docs", [  'exec:api_styles', 'exec:api_docs', 'exec:docco' ]);
  grunt.registerTask('release', ['jshint','concat:dist','uglify:dist','exec:gzip']);
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-shell');
     

};
