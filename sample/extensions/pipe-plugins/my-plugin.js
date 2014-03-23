var handle=function(req,res,session,handlers){
    var log=new Log();
    log.debug('my pipe plugin, does nothing!');
    handlers();
};