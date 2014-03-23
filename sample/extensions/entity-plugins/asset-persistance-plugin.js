/**
 * Description: The plug-in performs persistence operations to the registry
 */
var assetPersistancePlugin = function (schema, options) {
    var log = new Log();

    schema.to('save', function (entity) {
        log.debug('Saving the ' + schema.meta.name + ' to the registry.');
    });

    schema.to('remove', function (entity) {
        log.debug('Removing the ' + schema.meta.name + ' from the registry.');
    });

};