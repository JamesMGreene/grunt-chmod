[![Build Status](https://travis-ci.org/JamesMGreene/grunt-chmod.png?branch=master)](https://travis-ci.org/JamesMGreene/grunt-chmod)

# grunt-chmod

> A Grunt task plugin to modify file permissions, a la `chmod`.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-chmod --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-chmod');
```

## The "chmod" task

### Overview
In your project's Gruntfile, add a section named `chmod` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  chmod: {
    options: {
      mode: '755'
    },
    yourTarget1: {
      // Target-specific file/dir lists and/or options go here.
      src: ['**/*.js']
    }
  }
});
```

### Options

#### options.mode
Type: `String`
Default value: _none_ (required)

A string value to specify the permissions' [`chmod`-style numeric or symbolic mode](http://ss64.com/bash/chmod.html) to set on the files and/or directories, e.g.:
 - `'755'`
 - `'644'`
 - `'400'`
 - `'a+X'`
 - `'ug+rw'`

### Usage Examples

#### Custom Options
Check the comments per section in this example for an explanation of what it does.

```js
grunt.initConfig({
  chmod: {
    options: {
      mode: '755'
    },
    yourTarget1: {
      // For '.js' files anywhere under the directory that contains this 'Gruntfile.js' file,
      // set the files permissions so that everyone can read and execute the files but only the
      // owner can write to the files.
      src: ['**/*.js']
    },
    yourTarget2: {
      // For '.json' files anywhere under the 'src' or 'test' directories, set the file permissions
      // so that everyone can read the files but only the owner can write to the files.
      options: {
        mode: '644'
      },
      src: ['src/**/*.json', 'test/**/*.json']
    },
    yourTarget3: {
      // For the 'node_modules' directory, set the directory permissions so that only the owner has
      // read permissions.
      options: {
        mode: '400'
      },
      src: ['node_modules/']
    }
  }
});
```

### Warnings
 - On Windows (tested with Windows 7), the only possible values seem to be `'666'`(read/write for all users) or `'444'` (read only for all users). Whatever number is set in the user column (the hundreds place value) will become the value for all columns (user, group, and other), e.g. `'400'` becomes `'444'`.  The default permissons for both newly created files and folders is `'666'`.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


## License
Copyright (c) 2013-2015 James M. Greene

Licensed under the MIT license.
