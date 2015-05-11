Ext.define('Spark2Manager.controller.Apply', {
    requires: [
        'Spark2Manager.store.ApplyProjects',
        'Spark2Manager.store.ApplyToDos',
        'Spark2Manager.store.ApplyLinks'
    ],

    extend: 'Ext.app.Controller',

    config: {
        refs: [{
            ref: 'panel',
            selector: 's2m-apply-panel'
        }],

        control: {
            's2m-apply-panel': {
                activate: 'onPanelActivate'
            }
        }
    },

    stores: [
        'ApplyProjects',
        'ApplyToDos',
        'ApplyLinks'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },

    onPanelActivate: function() {
        this.getApplyProjectsStore().load();
        this.getApplyToDosStore().load();
        this.getApplyLinksStore().load();
    }
});
