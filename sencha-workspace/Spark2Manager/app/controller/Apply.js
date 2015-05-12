Ext.define('Spark2Manager.controller.Apply', {
    requires: [
        'Spark2Manager.store.ApplyProjects',
        'Spark2Manager.view.StandardPicker'
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
        'ApplyProjects'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },

    onPanelActivate: function() {
        this.getApplyProjectsStore().load();
    }
});
