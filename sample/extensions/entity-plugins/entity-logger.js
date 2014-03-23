/**
 * Description: The plug-in is responsible for logging the contents of an asset at each event
 * of an asset
 * Filename:entity-logger.js
 */
var entityPlugin = function (schema,options) {
    var log = new Log('entity-logger');

    log.debug('entity-logger plugin registered with '+stringify(options));

    schema.add({
        logType:{type:String,default:'Simple Logger'}
    });

    schema.pre('save', function (entity) {
        log.debug('Before been saved '+options.title);
        log.debug(stringify(entity));
    });

    schema.post('save',function(entity){
       log.debug('Entity saved successfully '+options.title);
    });

    schema.pre('init',function(entity){
        log.debug('Initialize called '+schema.meta.name);
    });

};