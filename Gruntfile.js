/* global require */
(function() {
  'use strict';

  module.exports = function(grunt) {
    // Load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
      clean: {
        dist: ['angular-ra-*.js']
      },

      concat: {
        options: {
          banner: "'use strict';\n",
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
                   src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          }
        },

        dist: {
          src:  ['src/angular-ra-flash.js', 'src/**/*.js'],
          dest: 'angular-ra-flash.js'
        }
      },

      ngmin: {
        dist: {
          src:  ['angular-ra-flash.js'],
          dest: 'angular-ra-flash.min.js'
        }
      },

      uglify: {
        dist: {
          src:  ['angular-ra-flash.min.js'],
          dest: 'angular-ra-flash.min.js'
        }
      },

      bower: {
        options: {
          copy: false
        },
        install: {}
      },

      jshint: {
        src: {
          options: {
            jshintrc: '.jshintrc'
          },
          files: {
            src: ['Gruntfile.js', 'src/{,*/}*.js']
          }
        },

        test: {
          options: {
            jshintrc: 'test/.jshintrc'
          },
          files: {
            src: ['test/{,*/}*.js']
          }
        }
      },

      karma: {
        dev: {
          configFile: 'karma.conf.js',
          singleRun: false
        },

        dist: {
          configFile: 'karma.conf.js'
        }
      },

      bump: {
        options: {
          files:       ['package.json', 'bower.json'],
          commitFiles: ['package.json', 'bower.json'],
          pushTo:      'origin'
        }
      }
    });

    grunt.registerTask('test', 'karma:dev');
    grunt.registerTask('build', ['jshint', 'clean', 'concat', 'ngmin', 'uglify']);
  };
})();
