/**
 * The top level container for the Modules section of the website
 *
 * @event moduleupdate
 * Fires when the module has been updated.
 * @param {SparkRepositoryManager.view.modules.Panel} moduleContainer
 * @param {SparkRepositoryManager.model.Module} module
 * @param {SparkRepositoryManager.model.Module} oldModule
 */
Ext.define('SparkRepositoryManager.view.modules.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 's2m-modules-panel',
    requires: [
        'SparkRepositoryManager.view.modules.Navigator',
        'SparkRepositoryManager.view.modules.editor.Editor'
    ],

    config: {
        module: null
    },

    layout: 'border',

    items: [
        {
            region: 'west',
            xtype: 's2m-modules-navigator',
            width: 320
        },
        {
            region: 'center',
            xtype: 's2m-modules-editor'
        }
    ],

    updateModule: function(module, oldModule) {
        var me = this;

        me.fireEvent('moduleupdate', me, module, oldModule);
    }

});
