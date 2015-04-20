/**
 * Created by jmealo on 4/14/15.
 */
Ext.define('Spark2Manager.controller.Learn', {
    requires: [
        'Spark2Manager.store.Links'
    ],
    extend: 'Ext.app.Controller',

    config: {
        refs: [{
            ref: 'panel',
            selector: 's2m-learn-panel'
        }],

        control: {
            's2m-learn-panel': {
                activate: 'onPanelActivate',
                edit: 'onEdit'
            },
            's2m-learn-panel button[action=create-link]': {
                click: 'onCreateLinkClick'
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
    },

    onCreateLinkClick: function() {
        var newLink = this.getLinksStore().insert(0, {}),
            p = this.getPanel(),
            plugin = p.getPlugin('cellediting');

        plugin.startEdit(newLink[0], 0);
    }
});
