/*
 * grunt-module-concat
 * 
 *
 * Copyright (c) 2014 jalalc
 * Licensed under the MIT license.
 */


module.exports = function (grunt)
{
    'use strict';

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    function Module(name, destDir, prefixName, extension)
    {

        var _readWrapFile = function (filepath)
        {
            if (filepath !== null || typeof filepath !== 'undefined')
            {
                if (!grunt.file.exists(filepath) && !grunt.file.isFile(filepath))
                {
                    grunt.fail.fatal('Missing file or not a file : ' + filepath);
                }
                return grunt.file.read(filepath);
            }
            return '';
        };

        var self = {
            name     : name,
            out      : [destDir, '/', prefixName, name, '.', extension].join(''),
            destSrcs : [],
            appendSrc: function (fileSrc)
            {
                self.destSrcs.push(fileSrc);
            },
            get      : function (wrapBegin, wrapEnd)
            {
                var out = [];

                out.push(_readWrapFile(wrapBegin));
                self.destSrcs.forEach(function (src)
                {
                    out.push(src);
                });
                out.push(_readWrapFile(wrapEnd));
                return out.join('');
            }
        };
        return self;
    }

    grunt.registerMultiTask('module_merge', 'The best Grunt plugin ever.',
        function ()
        {
            var moduleRegex = /@module\ {1,}[a-zA-Z0-9_-]{1,}\ */;
            var registeredModules = {};
            var options = this.options();

            this.files.forEach(function (file)
            {
                file.src.filter(function (filepath)
                {
                    if (!grunt.file.exists(filepath))
                    {
                        grunt.fail.warn('Source file ' + filepath + ' not found');
                        return false;
                    }
                    return true;
                }).forEach(function (filepath)
                {
                    var srcFile = grunt.file.read(filepath);
                    var moduleName = 'global';
                    var moduleStr = moduleRegex.exec(srcFile);
                    var module;

                    if (moduleStr != null)
                    {
                        moduleName = moduleStr[0].split(' ')[1];
                    }
                    module = registeredModules[moduleName];
                    if (typeof module === 'undefined')
                    {
                        module = new Module(moduleName, file.dest, 'module_', options.extension);
                        registeredModules[moduleName] = module;
                    }
                    module.appendSrc(srcFile);
                });
            });

            for (var moduleName in registeredModules)
            {
                var module = registeredModules[moduleName];

                grunt.file.write(module.out, module.get(options.wrapBegin, options.wrapEnd));
            }
            return 0;
        }
    );
};
