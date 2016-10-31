/**
 * The Modules controller manages the Modules section of the application where
 * staff can add and edit modules
 *
 * ## Responsibilities
 * - Add modules
 * - Edit modules
 */
Ext.define('SparkRepositoryManager.controller.Modules', {
    extend: 'Ext.app.Controller',
    requires: [
    ],

    // mutable state
    config: {

        /**
         * @private
         * Tracks the current module {@link SparkRepositoryManager.model.Module}
         */
        module: null
    },


    // dependencies
    stores: [
        'Modules'
    ],


    // component references
    refs: [

        // top level containers
        {
            ref: 'moduleCt',
            selector: 's2m-modules-panel'
        }, {
            ref: 'moduleEditor',
            selector: 's2m-modules-editor'
        }, {
            ref: 'moduleMeta',
            selector: 's2m-modules-editor form#modules-meta-info'
        },

        // intro tab
        {
            ref: 'sparkpointsCombo',
            selector: 's2m-modules-editor-intro combo[name="sparkpoints"]'
        }, {
            ref: 'sparkpointGrid',
            selector: 's2m-modules-editor-intro grid#sparkpoint-grid'
        }

    ],


    // entry points
    control: {

        // top level containers
        's2m-modules-panel': {
            moduleupdate: 'onModuleUpdate'
        },
        's2m-modules-navigator button[action="add-new-module"]': {
            click: 'onNewModuleClick'
        },
        '#modules-meta-info field': {
            change: 'onModuleMetaFieldChange'
        },
        's2m-modules-editor checkbox[name="shared"]': {
            change: 'onModuleMetaFieldChange'
        },

        // intro tab
        's2m-modules-editor-intro grid#sparkpoint-grid': {
            boxready: 'onSparkpointGridBoxready'
        },
        's2m-modules-editor-intro button[action="add-sparkpoint"]': {
            click: 'onAddSparkpointClick'
        },

        // other tabs
        's2m-modules-multiselector grid#module-grid': {
            boxready: 'onModuleGridBoxready'
        }
    },


    // controller templates method overrides
    init: function() {
        var me = this;

    //    if (me.getModule() === null) {
    //        me.setModule(Ext.create('SparkRepositoryManager.model.Module', {}));
    //    }
    },

    // config handlers
    updateModule: function(module) {
        this.loadModule(module);
    },


    // event handlers
    onModuleUpdate: function(container, module) {
        console.log('Module has been updated!'); // eslint-disable-line no-console
        module.save();
        console.log(module.getData()); // eslint-disable-line no-console
    },

    onNewModuleClick: function() {
        console.log('onNewModuleClick'); // eslint-disable-line no-console
        var me = this;

        me.setModule(Ext.create('SparkRepositoryManager.model.Module', {}));
        me.getModuleEditor().setDisabled(false);
    },

    onModuleMetaFieldChange: function(field, val) {
        var me = this,
            module = me.getModule();

        module.set(field.getName(), val);

        module.save();
        me.getModulesStore().sync();

    },

    // event handlers - Intro tab
    onSparkpointGridBoxready: function(grid) {
        var me = this;

        grid.getStore().addListener({
            datachanged: Ext.bind(me.updateSparkpoints, me),
            update: Ext.bind(me.updateSparkpoints, me)
        });
    },

    onAddSparkpointClick: function() {
        var me = this,
            sparkpoint = me.getSparkpointsCombo().getSelection(),
            store = me.getSparkpointGrid().getStore();

        if (sparkpoint) {
            store.add(sparkpoint);
        }
    },

    // event handlers - Other tabs
    onModuleGridBoxready: function(grid) {
        var me = this,
            itemType = grid.up('s2m-modules-multiselector').itemType.field;

        grid.getStore().addListener({
            datachanged: Ext.bind(me.updateSparkpointItems, me, [itemType, grid]),
            update: Ext.bind(me.updateSparkpointItems, me, [itemType, grid])
        });
    },


    // custom controller methods
    loadModule: function(module) {
        var me = this,
            meta = me.getModuleMeta();

        meta.loadRecord(module);

    },

    updateSparkpoints: function() {
        var me = this,
            module = me.getModule(),
            sparkpoints = me.getSparkpointGrid().getStore().getRange(),
            sparkpointsLength = sparkpoints.length,
            moduleSparkpoints = [],
            i = 0;

        for (; i<sparkpointsLength; i++) {
            moduleSparkpoints.push(sparkpoints[i].getData());
        }

        if (module !== null) {
            module.set('sparkpoints', moduleSparkpoints);
            module.save();
            me.getModulesStore().sync();
        }

    },

    onResourcesAddSparkpointClick: function() {
        console.log('onResourcesAddSparkpointClick'); // eslint-disable-line no-console
    },

    updateSparkpointItems: function(itemType, grid) {
        var me = this,
            module = me.getModule(),
            sparkpointItems = grid.getStore().getRange(),
            sparkpointItemsLength = sparkpointItems.length,
            moduleItems= [],
            i = 0;

        for (; i<sparkpointItemsLength; i++) {
            moduleItems.push(sparkpointItems[i].getData());
        }

        if (module !== null) {
            module.set(itemType, moduleItems);
            module.save();
            me.getModulesStore().sync();
        }
    }
});
