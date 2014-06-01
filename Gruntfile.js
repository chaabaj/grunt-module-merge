/*
 * grunt-module-merge
 * 
 *
 * Copyright (c) 2014 jalalc
 * Licensed under the MIT license.
 */



module.exports = function (grunt) {
  'use strict';
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    module_merge: {
        files: {
            src: ['test/fixtures/**/*.js'],
            dest: ['test/out/']
        },
        options : {
            wrapBegin : 'test/config/amd_module_begin.js',
            wrapEnd : 'test/config/amd_module_end.js',
            extension : 'js'
        }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'module_merge', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
