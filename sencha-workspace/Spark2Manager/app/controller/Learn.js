/**
 * Created by jmealo on 4/14/15.
 */
Ext.define('Spark2Manager.controller.Learn', {
    requires: [
        'Spark2Manager.store.Links'
    ],
    extend: 'Ext.app.Controller',

    config: {
        /*
        Uncomment to add references to view components
        refs: [{
            ref: 'list',
            selector: 'grid'
        }],
        */

        control: {
            's2m-learn-panel': {
                activate: 'onPanelActivate',
                edit: 'onEdit'
            }
        }
    },

    stores: [
        'Links'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },

    onPanelActivate: function() {
        this.getLinksStore().load();
    },

    onEdit: function(editor, e) {
        switch(e.column.dataIndex) {
            case 'Link':
                e.record.set('Vendor', new URL(e.value).hostname);
        }
    }
});
