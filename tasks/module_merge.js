/**
 * Created by CHAABANE on 08/03/2015.
 */

var fork = require('child_process').fork;
var nbCoreActive = require('os').cpus().length;
var mkdirp = require('mkdirp');

module.exports = function (grunt)
{
    var killAllProcess = function(childs)
    {
        childs.forEach(function(child)
        {
            child.kill();
        });
    };

    var moduleMergeInit = function ()
    {
        var files = this.files.reduce(function(oldValue, file)
        {
            return oldValue.concat(file.src);
        }, []);
        var done = this.async();
        var childs = [];
        var nbFilesPerProcess = this.files.length / nbCoreActive;

        if (nbFilesPerProcess < 1)
        {
            nbCoreActive = files.length;
            nbFilesPerProcess = 1;
        }
        mkdirp.sync(this.files[0].dest);
        for (var i = 0; i < nbCoreActive; ++i)
        {
            var childFiles = files.slice(i * nbFilesPerProcess, (i * nbFilesPerProcess) + nbFilesPerProcess);

            grunt.log.ok('Nb cores : ' + nbCoreActive);
            var child = fork('src/process-script.js', [this.files[0].dest, childFiles], {
                cwd : process.cwd()
            });

            child.on('exit', function ()
            {
                nbCoreActive--;
                if (nbCoreActive === 0)
                {
                    done();
                }
            });

            child.on('message', function(msg)
            {
                if (msg.type === 'error')
                {
                    killAllProcess(childs);
                    grunt.fail.fatal(msg.msg);
                }
            });
            childs.push(child);
        }
    };

    grunt.registerMultiTask('module_merge', 'Merging module files in one files', moduleMergeInit);
};