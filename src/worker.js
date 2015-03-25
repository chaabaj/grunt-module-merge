/**
 * Created by CHAABANE on 11/03/2015.
 */

var fs = require('fs');
var html2js = require('ng-html2js');
var globule = require('globule');

var destArgs = process.argv[2];
var filesArgs = process.argv.slice(3);

var resolveFiles = function (files, modulePath)
{
    return globule.find(files, {srcBase: modulePath, prefixBase: true})
};

var moduleMerge = function (moduleFiles, dest)
{
    var tplRegex = /.*\.tpl\.html|.*\.html/;


    moduleFiles.forEach(function (moduleFile)
    {
        try
        {
            var content = fs.readFileSync(moduleFile);
            var moduleDef = JSON.parse(content.toString());
            var outputFile = [dest, moduleDef.name].join('/') + '.js';
            var modulePath = moduleFile.substring(0, moduleFile.lastIndexOf("/"));
            var files = resolveFiles(moduleDef.files, modulePath);
            console.log(files);
            var alreadyAppendedFiles = {};

            files.forEach(function (file)
            {
                if (!alreadyAppendedFiles[file])
                {
                    if (tplRegex.test(file))
                    {
                        var content = html2js(file, fs.readFileSync(file, 'utf-8'),
                                              moduleDef.viewsModule || moduleDef.name, null);

                        fs.appendFileSync(outputFile, content);
                    }
                    else
                    {
                        fs.appendFileSync(outputFile, fs.readFileSync(file));
                    }
                    alreadyAppendedFiles[file] = true;
                }
            });
        }
        catch (err)
        {

            process.send( {type: 'error', moduleName: moduleFile, msg: err.message});
        }


    });

    return 0;
};

moduleMerge(filesArgs, destArgs);

process.exit(0);