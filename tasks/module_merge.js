/**
 * Created by CHAABANE on 08/03/2015.
 */

var mkdirp = require('mkdirp');
var workerPath = [__dirname,'../src/worker.js'].join('/');
var nbCores = require('os').cpus().length;
var fork = require('child_process').fork;

module.exports = function (grunt)
{

    var moduleMergeInit = function ()
    {
        var done = this.async();
        var dest = this.files[0].dest;
        var files = this.files.reduce(function (oldValue, file)
        {
            return oldValue.concat(file.src);
        }, []);

        mkdirp.sync(dest);

        var nbFilePerCore = Math.round(files.length / nbCores);

        if (nbFilePerCore < 1)
        {
            nbFilePerCore = 1;
        }
        var filesLength = files.length;

        grunt.log.writeln('Running merge module on : ' + nbCores);
        grunt.log.writeln('For ' + nbFilePerCore  + ' module per core');
        for (var i = 0; i < filesLength; i += nbFilePerCore)
        {
            var childFiles = files.slice(i, i + nbFilePerCore);

            var child = fork(workerPath, [dest].concat(childFiles));

            child.on('message', function(err)
            {
                grunt.fail.fatal(err.message);
            });

            child.on('exit', function()
            {
                if (--nbCores === 0)
                {
                    done();
                }
            });
        }


    };

    grunt.registerMultiTask('module_merge', 'Merging module files in one files', moduleMergeInit);
};