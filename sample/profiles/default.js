var init=function(pipe){
    var log=new Log();
    log.debug('DEFAULT PROFILE');

    pipe.plug(require('/extensions/universal/simpleRequestLogger.js'));
};