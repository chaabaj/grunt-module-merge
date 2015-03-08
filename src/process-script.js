/**
 * Created by CHAABANE on 08/03/2015.
 */

var fs = require('fs');


var moduleFiles = process.argv.slice(3);
var dest = process.argv[2];

function resolveFiles(moduleDef)
{
    //TODO implement globbing
    return moduleDef.files;
}


moduleFiles.forEach(function (moduleFile)
{
    try
    {
        var content = fs.readFileSync(moduleFile);
        var moduleDef = JSON.parse(content.toString());
        var files = resolveFiles(moduleDef);
        var outputFile = [dest, moduleDef.name].join('/') + '.js';
        var modulePath = moduleFile.substring(0, moduleFile.lastIndexOf("/"));


        files.forEach(function(file)
        {
            var fullpath = [modulePath, file].join('/');

            console.log(fullpath);
            fs.appendFileSync(outputFile, fs.readFileSync(fullpath));
        });
    }
    catch (err)
    {
        process.send({type: 'error', msg: err.message});
    }
});

process.exit(0);