var logger=function(Fiber,options){
    var log=new Log('logger');

    Fiber.events.on('*','*',function(context){
            log.debug('Target: '+context.target+' action: '+context.action);
    });
};