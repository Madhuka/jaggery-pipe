/**
 * Description: The Entity module implements a basic entity management framework
 */
var entity = {};

(function () {

    var entityManager = new EntityManager();
    var log = new Log('jaggery-entity');
    var utils = require('/modules/utils.js');

    function EntityManager() {
        this.schemas = {};
        this.generators = {};
    }

    /**
     * The function is used to register a schema with the entity manager
     */
    EntityManager.prototype.register = function (schema) {
        var schemaName = schema.meta.name;

        //Do nothing if the schema name has not been provided
        if (schemaName) {
            this.schemas[schemaName] = schema;
            this.generators[schemaName] = generator(schema);
        }
    };

    /**
     * The function returns an entity instance given the schema name of the entity
     * @param schemaName
     */
    EntityManager.prototype.entity = function (schemaName) {
        if (this.generators.hasOwnProperty(schemaName)) {
            var generator= this.generators[schemaName];
            var schema=this.schemas[schemaName];

            //Attach the static methods
            attachStaticMethods(generator,schema);

            //TODO:Cache this the first time so we don't loop
            return generator;
        }
        return null;
    };

    /**
     * The function adds static methods defined in the schema to the
     * generator function
     * @param generator
     * @param schema
     */
    var attachStaticMethods=function(generator,schema){
        for(var index in schema.static){
            generator[index]=schema.static[index];
        }
    };

    function EntitySchema(entityName, entityProps, entityMeta) {
        this.meta = entityMeta || {};
        this.props = entityProps || {};
        this.meta.name = entityName;
        this.meta.plugins = {};

        //Register the schema
        EntitySchema._em.register(this);

        this.methods = {};
        this.static={};

        //initPlugins(this);

        this.meta.plugins.save={pre:[],post:[]};
        this.meta.plugins.init={pre:[],post:[]};
        this.meta.plugins.validate={pre:[],post:[]};
        this.meta.plugins.remove={pre:[],post:[]};
    }

    var initPlugins=function(schema){
        schema.meta.plugins.save={pre:[],post:[]};
        schema.meta.plugins.init={pre:[],post:[]};
        schema.meta.plugins.validate={pre:[],post:[]};
        schema.meta.plugins.remove={pre:[],post:[]};
    };

    EntitySchema.prototype.pre = function (action, handler) {

        initPlugins(action, this.meta.plugins);

        this.meta.plugins[action].pre.push(handler);
        log.info(this.meta.plugins);
    };

    EntitySchema.prototype.post = function (action, handler) {

        initPlugins(action, this.meta.plugins);

        this.meta.plugins[action].post.push(handler);
    };

    EntitySchema.prototype.save = function (entity) {
        var entity=entity.toJSON();
        var preSave = this.meta.plugins.save.pre;
        var postSave = this.meta.plugins.save.post;

        executePluginList(entity, preSave);
        log.info('Entity saved');
        executePluginList(entity, postSave);
    };

    EntitySchema.prototype.init = function (entity) {
        var entity=entity.toJSON();
        var pre=this.meta.plugins.init.pre;
        var post=this.meta.plugins.init.post;

        executePluginList(entity,pre);
        log.info('Entity initialized');
        executePluginList(entity,post);
    };

    EntitySchema.prototype.validate = function () {

    };

    EntitySchema.prototype.remove=function(){
        var entity=entity.toJSON();
        var pre=this.meta.plugins.remove.pre;
        var post=this.meta.plugins.remove.post;

        executePluginList(entity,pre);
        log.info('Entity removed!');
        executePluginList(entity,post);
    };


    /**
     * The function allows a plugin to install itself for the schema
     * @param plugin  The plug-in to be installed to the schema
     */
    EntitySchema.prototype.plug = function (plugin) {
        plugin(this);
    };


    var initPlugins = function (action, plugins) {
        if (!plugins.hasOwnProperty(action)) {
            plugins[action] = {};
            plugins[action].pre = [];
            plugins[action].post = [];
        }
    };

    /**
     * The function executes each plugin in an array of plug-ins while
     * giving plug-in the option to continue to the next or stop processing
     * @param plugins
     */
    var executePluginList = function (entity, plugins) {
        if (plugins.length == 0) {
            return;
        }
        var index = -1;

        log.info('Plugins: ' + stringify(plugins));
        log.info(plugins[index]);
        var next = function (entity, index) {
            if (plugins.length < index) {
                return;
            }
            else {
                index++;
                return plugins[index](entity, next);
            }
        };

        next(entity, index);
    };

    /**
     * The generator method takes a schema and then prepares a class which can be instanitaed by the user
     * @param schema The schema on which the class should be created
     * @returns An object which can be used to describe assets
     */
    var generator = function (schema) {

        var ptr = function (options) {

            //Add the properties that should be present based on the schema
            utils.reflection.copyPropKeys(schema.props, this);

            utils.reflection.copyProps(options, this);

            //Bind the methods to the object
            for (var index in schema.methods) {
                this[index] = schema.methods[index];
            }

            this.init();
        };

        ptr.prototype.getSchema = function () {
            return schema;
        };

        ptr.prototype.save = saveHandler;
        ptr.prototype.remove = removeHandler;
        ptr.prototype.validate = validateHandler;
        ptr.prototype.init = initHandler;
        ptr.prototype.toJSON=toJSON;

        log.info('Check static method');
        log.info(stringify(schema.static));
        attachStaticMethods(ptr,schema);

        return ptr;
    };

    var attachStaticMethods=function(obj,schema){

      for(var index in schema.static){
          log.info('Static method: '+index);
         obj[index]=schema.static[index];
      }

    };

    var initHandler = function () {
        this.getSchema().init(this);
    };
    /**
     * The toJSON method
     * @returns {{}}
     */
    var toJSON = function () {
        var data = {};
        utils.reflection.copyProps(data, this);
        return data;
    };

    var saveHandler = function () {
        this.getSchema().save(this);
    };

    var removeHandler = function () {
        this.getSchema().remove(this);
    };

    var validateHandler = function () {
        this.getSchema().validate(this);
    };


    /**
     * A utility method to return an Entity
     * @param schemaName
     * @returns {*}
     */
    var getEntity = function (schemaName) {
        return entityManager.entity(schemaName);
    };

    EntitySchema._em = entityManager;


    entity.EntitySchema = EntitySchema;
    entity.EntityManager = entityManager;
    entity.Entity = getEntity;

}());