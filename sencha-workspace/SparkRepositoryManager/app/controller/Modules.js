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
        's2m-modules-editor-intro button[action="add-sparkpoint"]': {
            click: 'onAddSparkpointClick'
        },

    },

    // event handlers
    onModuleUpdate: function(container, module) {
        console.log('Module has been updated!'); // eslint-disable-line no-console
        console.log(module); // eslint-disable-line no-console
    },

    onNewModuleClick: function() {
        console.log('onNewModuleClick'); // eslint-disable-line no-console
    },

    onAddSparkpointClick: function() {
        var me = this,
            sparkpoint = me.getSparkpointsCombo().getValue(),
            store = me.getSparkpointGrid().getStore();

        if (sparkpoint) {
            store.add({ code: sparkpoint });
        }
    }
});
