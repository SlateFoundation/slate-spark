Ext.define('SparkRepositoryManager.controller.Sparkpoints', {
    extend: 'Ext.app.Controller',

    stores: [
        'sparkpoints.Sparkpoints',
        'sparkpoints.Dependencies',
        'sparkpoints.Dependents',
        'StandardDocuments'
    ],

    config: {
        refs: {
            panel: 'srm-sparkpoints-panel',
            contentAreasTree: 'srm-sparkpoints-contentareastree',
            gridPanel: 'srm-sparkpoints-grid'
        },

        control: {
            panel: {
                activate: 'onPanelActivate'
            },
            gridPanel: {
                activate: 'onGridPanelActivate'
            }
        }
    },


    onPanelActivate: function(panel) {
        var store = this.getContentAreasTree().getStore();
        
        if (!store.isLoaded() || !store.isLoading()) {
            store.load();
        }
    },

    onGridPanelActivate: function(gridPanel) {
        var store = gridPanel.getStore();

        if (!store.isLoaded() || !store.isLoading()) {
            store.load();
        }
    }
});