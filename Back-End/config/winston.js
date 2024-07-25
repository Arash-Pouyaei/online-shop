const winston = require("winston")
const approot = require("app-root-path")

const logger = new winston.createLogger({
    transports:[
        new winston.transports.File({
            level:"",
            filename: `${approot}/logs/app.log`,
            handleExceptions:true,
            format: winston.format.json(),
            maxsize:5000000,
            maxFiles:10
        }),
        new winston.transports.Console({
            level:"debug",
            handleExceptions:true,
            format:winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ],
    exitOnError: false
})

logger.stream = {
    write: function(message) {
        logger.info(message)
    }
}

module.exports=logger