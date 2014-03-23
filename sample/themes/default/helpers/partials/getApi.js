var resources=function(page,meta){
    var log=new Log();
    log.debug('Resources method called');
    return{
        js:['getApi.js'],
        css:['common.css']
    }
};