'use strict';

var grunt = require('grunt');
var helpers = require('./helpers');

exports.chmod = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  
  default_options: function(test) {
    test.expect(1);

    var actual = grunt.file.readJSON('tmp/default_options.json');
    var expected = grunt.file.readJSON('test/expected/default_options.json');
    test.deepEqual(actual, expected, 'Task should fail when relying on the default options.');

    test.done();
  },
  
  custom_options_without_string_mode: function(test) {
    test.expect(1);

    var actual = grunt.file.readJSON('tmp/custom_options_without_string_mode.json');
    var expected = grunt.file.readJSON('test/expected/custom_options_without_string_mode.json');
    test.deepEqual(actual, expected, 'Task should fail when setting a non-string `mode` on the custom options.');

    test.done();
  },
  
  custom_options_with_empty_mode: function(test) {
    test.expect(1);

    var actual = grunt.file.readJSON('tmp/custom_options_with_empty_mode.json');
    var expected = grunt.file.readJSON('test/expected/custom_options_with_empty_mode.json');
    test.deepEqual(actual, expected, 'Task should fail when setting an empty string `mode` on the custom options.');

    test.done();
  },
  
  custom_options_with_invalid_mode: function(test) {
    test.expect(1);

    var actual = grunt.file.readJSON('tmp/custom_options_with_invalid_mode.json');
    var expected = grunt.file.readJSON('test/expected/custom_options_with_invalid_mode.json');
    test.deepEqual(actual, expected, 'Task should fail when setting an invalid string `mode` on the custom options.');

    test.done();
  },
  
  custom_options_nonexistent_file: function(test) {
    test.expect(1);

    var actual = grunt.file.readJSON('tmp/custom_options_nonexistent_file.json');
    var expected = grunt.file.readJSON('test/expected/custom_options_nonexistent_file.json');
    test.deepEqual(actual, expected, 'Task should pass but not modify any file permissions when there are no files that match.');

    test.done();
  },
  
  custom_options_file: function(test) {
    test.expect(2);

    var actual = grunt.file.readJSON('tmp/custom_options_file.json');
    var expected = grunt.file.readJSON('test/expected/custom_options_file.json');
    test.deepEqual(actual, expected, 'Task should pass and modify the file permissions of all files that match.');
    
    var rawMode = require('fs').statSync('tmp/custom_options_file.js').mode;
    var numericMode = helpers.permsFromMode(rawMode);
    
    var actualPerms = '' + numericMode;
    var expectedPerms = '444';
    test.strictEqual(actualPerms, expectedPerms, 'Permissions should match.');

    test.done();
  },
  
  custom_options_dir: function(test) {
    test.expect(2);

    var actual = grunt.file.readJSON('tmp/custom_options_dir.json');
    var expected = grunt.file.readJSON('test/expected/custom_options_dir.json');
    test.deepEqual(actual, expected, 'Task should pass and modify the directory permissions of all directories that match.');
    
    var rawMode = require('fs').statSync('tmp/custom_options_dir/').mode;
    var numericMode = helpers.permsFromMode(rawMode);
    
    var actualPerms = '' + numericMode;
    var expectedPerms = '444';
    test.strictEqual(actualPerms, expectedPerms, 'Permissions should match.');

    test.done();
  },

  custom_options_file_symbolic_1: function(test) {
    test.expect(2);

    var actual = grunt.file.readJSON('tmp/custom_options_file_symbolic_1.json');
    var expected = grunt.file.readJSON('test/expected/custom_options_file_symbolic_1.json');
    test.deepEqual(actual, expected, 'Task should pass and modify the file permissions of all files that match.');
    
    var rawMode = require('fs').statSync('tmp/custom_options_file_symbolic_1.js').mode;
    var numericMode = helpers.permsFromMode(rawMode);
    
    var actualPerms = '' + numericMode;
    var expectedPerms = '400';
    test.strictEqual(actualPerms, expectedPerms, 'Permissions should match.');

    test.done();
  },

  custom_options_file_symbolic_2: function(test) {
    test.expect(2);

    var actual = grunt.file.readJSON('tmp/custom_options_file_symbolic_2.json');
    var expected = grunt.file.readJSON('test/expected/custom_options_file_symbolic_2.json');
    test.deepEqual(actual, expected, 'Task should pass and modify the file permissions of all files that match.');
    
    var rawMode = require('fs').statSync('tmp/custom_options_file_symbolic_2.js').mode;
    var numericMode = helpers.permsFromMode(rawMode);
    
    var actualPerms = '' + numericMode;
    var expectedPerms = '600';
    test.strictEqual(actualPerms, expectedPerms, 'Permissions should match.');

    test.done();
  },

  custom_options_file_symbolic_3: function(test) {
    test.expect(2);

    var actual = grunt.file.readJSON('tmp/custom_options_file_symbolic_3.json');
    var expected = grunt.file.readJSON('test/expected/custom_options_file_symbolic_3.json');
    test.deepEqual(actual, expected, 'Task should pass and modify the file permissions of all files that match.');
    
    var rawMode = require('fs').statSync('tmp/custom_options_file_symbolic_3.js').mode;
    var numericMode = helpers.permsFromMode(rawMode);
    
    var actualPerms = '' + numericMode;
    var expectedPerms = '700';
    test.strictEqual(actualPerms, expectedPerms, 'Permissions should match.');

    test.done();
  },

  custom_options_file_symbolic_4: function(test) {
    test.expect(2);

    var actual = grunt.file.readJSON('tmp/custom_options_file_symbolic_4.json');
    var expected = grunt.file.readJSON('test/expected/custom_options_file_symbolic_4.json');
    test.deepEqual(actual, expected, 'Task should pass and modify the file permissions of all files that match.');
    
    var rawMode = require('fs').statSync('tmp/custom_options_file_symbolic_4.js').mode;
    var numericMode = helpers.permsFromMode(rawMode);
    
    var actualPerms = '' + numericMode;
    var expectedPerms = '404';
    test.strictEqual(actualPerms, expectedPerms, 'Permissions should match.');

    test.done();
  }  
};
