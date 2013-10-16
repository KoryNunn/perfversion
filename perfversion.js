var moduload = require('moduload');

function createBench(callback){
    var results = [],
        numberOfTests = 0,
        done = 0;

    var bench = function(name, loops, fn){
        numberOfTests++;
        var time = 0;
        for(var i = 0; i < loops; i++) {
            var startTime = Date.now();
            fn(i);
            time += (Date.now() - startTime);
        }
        results.push({
            name: name,
            loops: loops,
            time: time / loops
        });

        return bench;
    }

    bench.results = results;
    var doneTimeout;
    bench.done = function(){
        done++;
        clearTimeout(doneTimeout);
        doneTimeout = setTimeout(function(){
            if(done === numberOfTests){
                callback(results);
            }
        },0);
    };

    return bench;
}

module.exports = function(testModulesPath){
    return function(moduleName, version, testFunction, callback){
        moduload(moduleName, version, testModulesPath, function(error, lib){
            var bench = createBench(function(results){
                callback({
                    name: moduleName,
                    version: version,
                    results: results
                });
            });
            testFunction(lib, bench);
        });
    };
};