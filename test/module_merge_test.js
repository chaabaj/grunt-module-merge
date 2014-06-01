
var grunt = require('grunt');


exports.module_concat = {
    setUp: function (done)
    {
        'use strict';
        // setup here if necessary
        done();
    },
    test: function(test)
    {
        test.expect(1);
        test.equal(true, true);
        test.done();
    }
};
