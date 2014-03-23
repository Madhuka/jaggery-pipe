var render=function(theme,data){
    var log=new Log();
    log.debug('getAPi called');

    theme('index',{
       body:[
           {
               partial:'getApi',
               context:data
           }]
    });
};