/**
 * Created by CHAABANE on 08/03/2015.
 */

var mkdirp = require('mkdirp');
var fs = require('fs');

var moduleMerge = function (moduleFiles, dest)
{
    moduleFiles.forEach(function (moduleFile)
    {
        var content = fs.readFileSync(moduleFile);
        var moduleDef = JSON.parse(content.toString());
        var files = moduleDef.files;
        var outputFile = [dest, moduleDef.name].join('/') + '.js';
        var modulePath = moduleFile.substring(0, moduleFile.lastIndexOf("/"));

        files.forEach(function (file)
        {
            var fullpath = [modulePath, file].join('/');

            fs.appendFileSync(outputFile, fs.readFileSync(fullpath));
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