Ext.define('SparkRepositoryManager.controller.Sparkpoints', {
    extend: 'Ext.app.Controller',

    stores: [
        'StandardDocuments'
    ],

    config: {
        refs: {
            panel: 'srm-sparkpoints-panel',
            grid: 'srm-sparkpoints-grid'
        },

        control: {
            grid: {
                activate: 'onGridActivate'
            }
        }
    },


    onGridActivate: function(gridPanel) {
        var store = gridPanel.getStore();
        
        if (!store.isLoaded() || !store.isLoading()) {
            store.load();
        }
    }
});