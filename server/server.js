const express = require('express');
var config = require('./config');
var log = require('./libs/log')(module);
var cluster = require('cluster');
var sleep = require('system-sleep');

// if (cluster.isMaster) {
//     var numWorkers = require('os').cpus().length;

//     log.info('Master cluster setting up ' + numWorkers + ' workers...');

//     for (var i = 0; i < numWorkers; i++) {
//         cluster.fork();
//     }

//     cluster.on('online', function(worker) {
//         log.info('Worker ' + worker.process.pid + ' is online');
//     });

//     cluster.on('exit', function(worker, code, signal) {
//         log.info('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
//         log.info('Starting a new worker');
//         cluster.fork();
//     });
// } else {
// create node.js (express) server:
// =================================
const app = express();
app.set('port', config.get('port'));

var osUtils = require('os-utils');
osUtils.cpuUsage(function(v) {
    console.log('CPU Usage (%): ' + v);
    if (v > config.get('maxCpuUsage')) {
        console.log('****************!!!ATTANTION, CPU IS OVERLOAD!!!******************');
        sleep(config.get('timeToSleep'));
    }
});


//get static contentt processing module
var StaticContent = require("./static_content_processing");
// deal with Access-Control-Allow-Origin bag on client request
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
// middleware '/api/places'
app.use((req, res, next) => {

    var osUtils = require('os-utils');
    osUtils.cpuUsage(function(v) {
        //console.log( 'CPU Usage (%): ' + v );
        var maxCpuUsage = parseFloat(config.get('maxCpuUsage'));
        var currCPUusege = parseFloat(v);
        // if overload
        if (currCPUusege > maxCpuUsage) {
            console.log('****************!!!ATTANTION, CPU IS OVERLOAD!!!******************');
            sleep(config.get('timeToSleep'));

        } else {
            console.log('CPU IS OK!');
            if (req.url == '/api/places') {

                //create static content processing module
                var staticContent = new StaticContent(req, res);
                // get stat. content and perform response to front-end
                var type = 'places';
                staticContent.getStaticContent(type);
            } else {
                // let's go to next middleware
                next();
            }
        }
    });
});
app.listen(app.get('port'), () => {
    log.info('Server started on port ' + app.get('port'));
    log.info('Process ' + process.pid + ' is listening to all incoming requests on port ' + app.get('port'));
});
// ================================================
// }