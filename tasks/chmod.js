/*
 * grunt-chmod
 * https://github.com/JamesMGreene/grunt-chmod
 *
 * Copyright (c) 2013 James M. Greene
 * Licensed under the MIT license.
 */

'use strict';

var shelljs = require('shelljs');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('chmod', 'Modify file permissions, a la `chmod`.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      mode: '',
      emit: false
    });

    var shouldEmit = options.emit === true;
    if (shouldEmit) {
      grunt.event.emit('chmod.taskTargetName', this.target);
    }

    var logError = createLogErrorFunc(shouldEmit);
    var taskFailure = createTaskFailureFunc(shouldEmit);
    var taskSuccess = createTaskSuccessFunc(shouldEmit);

    var mode = options.mode;

    // If there isn't any mode to set, then bail out
    if (!mode) {
      logError('No `mode` was specified in the task `options`. Task failed!');
      return taskFailure();
    }
    // If the mode set wasn't a string, then bail out
    if (typeof mode !== 'string') {
      logError('The `mode` specified in the task `options` was not a string. Task failed!');
      return taskFailure();
    }

    var fs = require('fs');
    var files = this.filesSrc;

    // Iterate over all specified file groups.
    files.forEach(function(path) {
      // Warn on and remove invalid source files (if nonull was set).
      if (!grunt.file.exists(path)) {
        logError('Source dir/file "' + path + '" not found.');
      }

      // Write the destination file.
      try {
        shelljs.chmod(mode, path);  //fs.chmodSync(path, mode);
      }
      catch (e) {
        logError('Failed to set `chmod` mode "' + mode + '" on dir/file: ' + path + '\n' + e);
      }
    });

    // Fail task if errors were logged.
    if (this.errorCount) {
      return taskFailure();
    }

    // Otherwise, print a success message.
    grunt.log.ok(files.length + ' file' + (files.length === 1 ? '' : 's') + ' had their `chmod` mode set to "' + mode + '".');
    return taskSuccess();
  });

  var createLogErrorFunc = function(shouldEmit) {
    if (shouldEmit) {
      return function(errorMsg) {
        grunt.event.emit('chmod.error', errorMsg);
        grunt.log.error(errorMsg);
      };
    }
    return function(errorMsg) {
      grunt.log.error(errorMsg);
    };
  };

  var createTaskFailureFunc = function(shouldEmit) {
    if (shouldEmit) {
      return function() {
        grunt.event.emit('chmod.fail');
        return false;
      };
    }
    return function() {
      return false;
    };
  };

  var createTaskSuccessFunc = function(shouldEmit) {
    if (shouldEmit) {
      return function() {
        grunt.event.emit('chmod.success');
        return true;
      };
    }
    return function() {
      return true;
    };
  };

};
