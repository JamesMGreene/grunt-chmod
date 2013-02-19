/*
 * grunt-chmod
 * https://github.com/JamesMGreene/grunt-chmod
 *
 * Copyright (c) 2013 James M. Greene
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      all: [
        'Gruntfile.js',
        'tasks/**/*.js',
        'test/**/*.js',
      ]
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    chmod: {
      default_options: {
        options: {
          emit: true
        },
        files: ['tmp/default_options.json']
      },
      custom_options_without_string_mode: {
        options: {
          mode: {},
          emit: true
        },
        files: ['tmp/custom_options_without_string_mode.json']
      },
      custom_options_with_empty_mode: {
        options: {
          mode: '',
          emit: true
        },
        files: ['tmp/custom_options_with_empty_mode.json']
      },
      custom_options_with_invalid_mode: {
        options: {
          mode: '',
          emit: true
        },
        files: ['tmp/custom_options_with_invalid_mode.json']
      },
      custom_options_file: {
        options: {
          mode: 'go-rwx',
          emit: true
        },
        files: ['tmp/custom_options_file.json']
      },
      custom_options_dir: {
        options: {
          mode: 'go-rwx',
          emit: true
        },
        files: ['tmp/custom_options_dir/']
      }
    },

    // Unit tests.
    nodeunit: {
      all: ['test/*_test.js']
    },
    
    

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  var forceValue = (function(val) {
    return (typeof val === 'boolean' ? val : !!val);
  })(grunt.option('force'));
  
  // Enable force for tests to avoid the build halting on warnings
  grunt.registerTask('force-enable', function() {
    grunt.option('force', true);
  });
  grunt.registerTask('force-revert', function() {
    grunt.option('force', forceValue);
  });
  
  // Test setup
  grunt.registerTask('test-setup', function() {
    grunt.file.mkdir('tmp');
  });
  
  // Test emission listeners
  var args = (function() {
    var slicer = Array.prototype.slice;
    return function(argsObj) {
      return slicer.call(argsObj, 0);
    };
  })();
  var emissions = [],
      taskTargetName;
  grunt.registerTask('listeners-on', function() {
    grunt.event.on('chmod.*', function(msg) {
      if (this.event === 'chmod.taskTargetName') {
        taskTargetName = msg;
        return;
      }
      var emission = {
        name: this.event,
        args: args(arguments)
      };
      emissions.push(emission);
    });
  });
  grunt.registerTask('listeners-off', function() {
    grunt.file.write('tmp/' + taskTargetName + '.json', JSON.stringify(emissions));
    
    emissions.length = 0;
    grunt.event.removeAllListeners('chmod.*');
  });
  
  var badConfigOptions = [
        'default_options',
        'custom_options_without_string_mode', 
        'custom_options_with_empty_mode',
        'custom_options_with_invalid_mode'
      ];
  badConfigOptions.forEach(function(e, i) {
    grunt.registerTask(
      'test-prep-' + (i + 1),
      [
        'force-enable',
        'listeners-on',
        'chmod:' + e,
        'listeners-off',
        'force-revert'
      ]
    );
  });
  var goodConfigOptions = [
        'custom_options_file',
        'custom_options_dir'
      ];
  goodConfigOptions.forEach(function(e, i) {
    grunt.registerTask(
      'test-prep-' + (badConfigOptions.length + i + 1),
      [
        'listeners-on',
        'chmod:' + e,
        'listeners-off'
      ]
    );
  });

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this plugin's
  // task(s), then test the result(s). Do NOT clean the "tmp" dir at the end!
  grunt.registerTask(
    'test',
    (function() {
      var taskList = [];
      taskList.push('clean');
      taskList.push('test-setup');
      for (var i = 1, len = (badConfigOptions.length + goodConfigOptions.length + 1); i < len; i++) {
        taskList.push('test-prep-' + i);
      }
      taskList.push('nodeunit');
      return taskList;
    })()
  );

  // By default: lint, run all tests, and clean it up.
  grunt.registerTask('default', ['jshint', /*'test',*/ 'clean']);

};
