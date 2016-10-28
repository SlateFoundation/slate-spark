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


    // component references
    refs: [

        // top level containers
        {
            ref: 'moduleCt',
            selector: 's2m-modules-panel'
        }, {
            ref: 'moduleEditor',
            selector: 's2m-modules-editor'
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
        's2m-modules-panel': {
            moduleupdate: 'onModuleUpdate'
        },
        's2m-modules-navigator button[action="add-new-module"]': {
            click: 'onNewModuleClick'
        },

        // intro tab
        's2m-modules-editor-intro grid#sparkpoint-grid': {
            boxready: 'onSparkpointGridBoxready'
        },
        's2m-modules-editor-intro button[action="add-sparkpoint"]': {
            click: 'onAddSparkpointClick'
        }

    },

    // event handlers
    onModuleUpdate: function(container, module) {
        console.log('Module has been updated!'); // eslint-disable-line no-console
        console.log('Module', module.getData()); // eslint-disable-line no-console
    },

    onNewModuleClick: function() {
        console.log('onNewModuleClick'); // eslint-disable-line no-console
    },

    // event handlers - Intro
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


    // custom controller methods - Intro
    updateSparkpoints: function() {
        var me = this,
            moduleCt = me.getModuleCt(),
            module = moduleCt.getModule(),
            sparkpoints = me.getSparkpointGrid().getStore().getRange(),
            sparkpointsLength = sparkpoints.length,
            moduleSparkpoints = [],
            i = 0;

        for (; i<sparkpointsLength; i++) {
            moduleSparkpoints.push(sparkpoints[i].getData());
        }

        if (module === null) {
            module = Ext.create('SparkRepositoryManager.model.Module', {});
        }

        module.set('sparkpoints', moduleSparkpoints);

        moduleCt.setModule(module);

    }
});
