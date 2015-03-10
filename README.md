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
            src : ['dir/**/*.json'],
            dest : 'build_dir/scripts/'
        },
    },
  },
})
```

Sample of module definition

```json
{
  "name" : "module",
  "files" : ["somefile.js", "other.js", "*.js]
}
```

The base path is the path where is the module definition file.
We support also the integration of angular template in the module

Example : 


```json
{
  "name" : "module",
  "files" : ["somefile.js", "other.js", "*.js, "*.tpl.html"]
}
```

## Release History
0.1.6

## License
Copyright (c) 2014 jalalc. Licensed under the MIT license.
