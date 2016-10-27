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
    refs: [{
        ref: 'moduleCt',
        selector: 's2m-modules-panel'
    }, {
        ref: 'moduleEditor',
        selector: 's2m-modules-editor'
    }],


    // entry points
    control: {
        's2m-modules-panel': {
            moduleupdate: 'onModuleUpdate'
        },
        's2m-modules-navigator button[action="add-new-module"]': {
            click: 'onNewModuleClick'
        }
    },

    // event handlers
    onModuleUpdate: function(container, module, oldModule) {
        console.log('Module has been updated!');
        console.log(module);
    },

    onNewModuleClick: function() {
        console.log('onNewModuleClick');
    }
});
