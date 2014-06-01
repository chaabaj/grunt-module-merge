# grunt-module-merge

> Experimental
> Plugin to merge file into module file using @module comment annotation.

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-module-merge --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-module-merge');
```

## The "module_merge" task

### Overview
In your project's Gruntfile, add a section named `module_merge` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  module_merge: {
        files {
            src : ['dir/**/*.js'],
            dest : 'build_dir/scripts/'
        // Task-specific options go here.
        },
        options : {
            wrapBegin : 'file_begin.js' // optional
            wrapEnd : 'file_end.js' // optional
            extension : 'js' // optional js by default
        }
    },
  },
})
```

Sample of source file

```js
/**
 * @module A1
 */

function test()
{
}
```

### Options

#### options.wrapBegin
Type: `String`
Default value: `''`

A file path

#### options.wrapEnd
Type: `String`
Default value: `''`

A file path

## Release History
0.0.1

## License
Copyright (c) 2014 jalalc. Licensed under the MIT license.
