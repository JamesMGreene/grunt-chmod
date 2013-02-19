'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.chmod = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  
  default_options: function(test) {
    test.expect(1);

    var actual = grunt.file.readJSON('tmp/actual/default_options.json');
    var expected = grunt.file.readJSON('test/expected/default_options.json');
    test.deepEqual(actual, expected, 'Task should have failed when relying on the default options.');

    test.done();
  },
  
  custom_options_without_string_mode: function(test) {
    test.expect(1);

    var actual = grunt.file.readJSON('tmp/actual/custom_options_without_string_mode.json');
    var expected = grunt.file.readJSON('test/expected/custom_options_without_string_mode.json');
    test.deepEqual(actual, expected, 'should describe what the custom option(s) behavior is.');

    test.done();
  },
  
  custom_options_with_empty_mode: function(test) {
    test.expect(1);

    var actual = grunt.file.readJSON('tmp/actual/custom_options_with_empty_mode.json');
    var expected = grunt.file.readJSON('test/expected/custom_options_with_empty_mode.json');
    test.deepEqual(actual, expected, 'should describe what the custom option(s) behavior is.');

    test.done();
  },
  
  custom_options_with_invalid_mode: function(test) {
    test.expect(1);

    var actual = grunt.file.readJSON('tmp/actual/custom_options_with_invalid_mode.json');
    var expected = grunt.file.readJSON('test/expected/custom_options_with_invalid_mode.json');
    test.deepEqual(actual, expected, 'should describe what the custom option(s) behavior is.');

    test.done();
  },
  
  custom_options: function(test) {
    test.expect(1);

    var actual = grunt.file.readJSON('tmp/actual/custom_options.json');
    var expected = grunt.file.readJSON('test/expected/custom_options.json');
    test.deepEqual(actual, expected, 'should describe what the custom option(s) behavior is.');

    test.done();
  }
};
