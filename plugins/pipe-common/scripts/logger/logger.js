/**
 * Description: A simple request logger
 */
var logger=(function(){
    var name = 'defaultLogger';

    var handle = function (req, res, session, handlers) {
        var log = new Log();
        log.debug('Request: '+req.getRequestURI());
        handlers();
    };

    return{
        name:name,
        handle:handle
    };

}());

