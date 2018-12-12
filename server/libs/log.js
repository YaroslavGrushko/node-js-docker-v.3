var winston = require('winston');
const { combine, timestamp, label, printf } = winston.format;
// configuaration file:
var config = require('../config');
var ENV = process.env.NODE_ENV;

function getLogger(module) {
    // my format
    const myFormat = printf(info => {
        var result = ``;
        if (config.get('log:format:timestamp') == 'true') result += `${info.timestamp} `
        if (config.get('log:format:label') == 'true') result += `[${info.label}] `
        if (config.get('log:format:level') == 'true') result += `${info.level} `
        if (config.get('log:format:message') == 'true') result += `${info.message} `
        return result
    });
    var path = module.filename.split('/').slice(-2).join('/');

    const logger = winston.createLogger({
        level: config.get('log:default-level'),
        format: combine(
            label({ label: config.get('log:lebel') }),
            timestamp(),
            myFormat
        ),
        transports: [
            //
            // - Write to all logs with level `info` and below to `combined.log` 
            // - Write all logs error (and below) to `error.log`.
            //
            new winston.transports.File({
                filename: config.get('log:error-file'),
                level: 'error'
            }),
            new winston.transports.File({
                filename: config.get('log:info-file'),
                label: path
            }),
        ],
    });

    //
    // If we're not in production then log to the `console` with the format:
    // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    // 
    if (ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.simple(),
            colorize: true,
            label: path
        }));
    }
    return logger;
}
module.exports = getLogger;