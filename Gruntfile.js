/*
 * grunt-chmod
 * https://github.com/JamesMGreene/grunt-chmod
 *
 * Copyright (c) 2013 James M. Greene
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');

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
      // Emit events, JUST for testing purposes!
      options: {
        emit: true
      },
      default_options: {
        src: ['tmp/default_options.txt']
      },
      custom_options_without_string_mode: {
        options: {
          mode: {}
        },
        src: ['tmp/custom_options_without_string_mode.txt']
      },
      custom_options_with_empty_mode: {
        options: {
          mode: ''
        },
        src: ['tmp/custom_options_with_empty_mode.txt']
      },
      custom_options_with_invalid_mode: {
        options: {
          mode: 'a+rwx'
        },
        src: ['tmp/custom_options_with_invalid_mode.txt']
      },
      custom_options_nonexistent_file: {
        options: {
          mode: '600'
        },
        src: ['tmp/custom_options_nonexistent_file.txt']
      },
      custom_options_file: {
        options: {
          /* Because it seems Windows will set the U digit (UGO) for all spots, so '400' => '444'. Default on Windows is: '666' */
          mode: '444'
        },
        src: ['tmp/custom_options_file.js']
      },
      custom_options_dir: {
        options: {
          /* Because it seems Windows will set the U digit (UGO) for all spots, so '400' => '444'. Default on Windows is: '666' */
          mode: '444'
        },
        src: ['tmp/custom_options_dir/']
      },
      custom_options_file_symbolic_1: {
        options: {
          mode: 'u+r' // 400
        },
        src: ['tmp/custom_options_file_symbolic_1.js']
      },
      custom_options_file_symbolic_2: {
        options: {
          mode: 'u+rw' // 600
        },
        src: ['tmp/custom_options_file_symbolic_2.js']
      },
      custom_options_file_symbolic_3: {
        options: {
          mode: 'u+rwx' // 700
        },
        src: ['tmp/custom_options_file_symbolic_3.js']
      },

      custom_options_file_symbolic_4: {
        options: {
          mode: 'uo+r' // 404
        },
        src: ['tmp/custom_options_file_symbolic_4.js']
      },

    },

    // Unit tests.
    nodeunit: {
      all: ['test/*_test.js']
    }

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
    grunt.file.mkdir('tmp/custom_options_dir');
    grunt.file.write('tmp/custom_options_file.js', '');

    grunt.file.write('tmp/custom_options_file_symbolic_1.js', '');
    grunt.file.write('tmp/custom_options_file_symbolic_2.js', '');
    grunt.file.write('tmp/custom_options_file_symbolic_3.js', '');
    grunt.file.write('tmp/custom_options_file_symbolic_4.js', '');

    fs.chmodSync('tmp/custom_options_file_symbolic_1.js', '000');
    fs.chmodSync('tmp/custom_options_file_symbolic_2.js', '000');
    fs.chmodSync('tmp/custom_options_file_symbolic_3.js', '000');
    fs.chmodSync('tmp/custom_options_file_symbolic_4.js', '000');
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
    grunt.file.write('tmp/' + taskTargetName + '.json', JSON.stringify(emissions, null, 2));

    emissions.length = 0;
    grunt.event.removeAllListeners('chmod.*');
  });

  var badConfigOptions = [
        'default_options',
        'custom_options_without_string_mode',
        'custom_options_with_empty_mode',
        'custom_options_with_invalid_mode',
        'custom_options_nonexistent_file'
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
        'custom_options_dir',
        'custom_options_file_symbolic_1',
        'custom_options_file_symbolic_2',
        'custom_options_file_symbolic_3',
        'custom_options_file_symbolic_4'
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
  grunt.registerTask('default', ['jshint', 'test', 'clean']);
  // Travis-CI: lint, run all tests, and clean it up.
  grunt.registerTask('travis', ['jshint', 'test', 'clean']);
};
