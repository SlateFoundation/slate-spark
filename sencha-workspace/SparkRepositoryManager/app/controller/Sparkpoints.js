Ext.define('SparkRepositoryManager.controller.Sparkpoints', {
    extend: 'Ext.app.Controller',

    requires: [
        'SparkRepositoryManager.store.Jurisdictions'
    ],

    stores: [
        'Jurisdictions'
    ],

    config: {
        refs: [{
            ref: 'panel',
            selector: 'srm-sparkpoints-panel'
        }],

        control: {
            'srm-sparkpoints-panel': {
                activate: 'onPanelActivate'
            }
        }
    },

    /**
     * Called when the view is created
     */
    init: function() {
        window.me = this;
    },

    onPanelActivate: function() {
        this.stores.forEach(function(store) {
            store = Ext.getStore(store);

            if (!(store.isLoaded() || store.isLoading())) {
                store.load();
            }
        });
    }
});
