/**
 * Created by CHAABANE on 08/03/2015.
 */

var mkdirp = require('mkdirp');
var fs = require('fs');
var html2js = require('ng-html2js');
var Q = require('q');
var glob = require('glob');

var resolveFiles = function(files, modulePath)
{
    var resolvedFiles = [];
    var deferred = Q.defer();

    files.forEach(function(file, index)
    {
        var fullpath = [modulePath, file].join('/');

        glob(fullpath, null, function(err, filesFound)
        {
            if (!err)
            {
                resolvedFiles = resolvedFiles.concat(filesFound);
            }
            else
            {
                console.error(err);
            }
            if (index === files.length - 1)
            {
                deferred.resolve(resolvedFiles);
            }
        });
    });
    return deferred.promise;
};

var moduleMerge = function (moduleFiles, dest)
{

    var tplRegex = /.*\.tpl\.html|.*\.html/;

    moduleFiles.forEach(function (moduleFile)
    {
        var content = fs.readFileSync(moduleFile);
        var moduleDef = JSON.parse(content.toString());
        var outputFile = [dest, moduleDef.name].join('/') + '.js';
        var modulePath = moduleFile.substring(0, moduleFile.lastIndexOf("/"));


        resolveFiles(moduleDef.files, modulePath).then(function(files)
        {
            var alreadyAppendedFiles = {};

            files.forEach(function (file)
            {
                if (!alreadyAppendedFiles[file])
                {
                    if (tplRegex.test(file))
                    {
                        var content = html2js(file, fs.readFileSync(file, 'utf-8'), moduleDef.name, null);

                        fs.appendFileSync(outputFile, content);
                    }
                    else
                    {
                        fs.appendFileSync(outputFile, fs.readFileSync(file));
                    }
                    alreadyAppendedFiles[file] = true;
                }
            });
        });

    });
    return 0;
};


module.exports = function (grunt)
{

    var moduleMergeInit = function ()
    {
        var files = this.files.reduce(function (oldValue, file)
        {
            return oldValue.concat(file.src);
        }, []);

        mkdirp.sync(this.files[0].dest);
        moduleMerge(files, this.files[0].dest);

    };

    grunt.registerMultiTask('module_merge', 'Merging module files in one files', moduleMergeInit);
};