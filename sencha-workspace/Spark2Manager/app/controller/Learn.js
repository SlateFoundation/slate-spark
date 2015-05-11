Ext.define('Spark2Manager.controller.Learn', {
    requires: [
        'Spark2Manager.store.LearnLinks',
        'Spark2Manager.store.Vendors',
        'Spark2Manager.store.VendorDomains',
        'Spark2Manager.Util',
        'Ext.Ajax',
        'Spark2Manager.view.StandardPicker'
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
                alignstandards: 'onAlignStandards'
            },
            's2m-learn-panel button[action=add]': {
                click: 'onAddClick'
            },
            's2m-learn-panel button[action=delete]': {
                click: 'onDeleteClick'
            },
            's2m-learn-panel button[action=align]': {
                click: 'onAlignClick'
            }
        }
    },

    stores: [
        'Vendors',
        'VendorDomains',
        'LearnLinks'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },

    onPanelActivate: function() {
        this.getVendorsStore().load();
        this.getVendorDomainsStore().load();
        this.getLearnLinksStore().load();
    },

    onAddClick: function() {
        var me = this,
            rowEditing = me.getPanel().plugins[0], // I used to be able to do getPlugin('cellediting') but not w/ row
            newLink = me.getLearnLinksStore().insert(0, {});

        rowEditing.cancelEdit();
        rowEditing.startEdit(newLink[0], 0);
    },

    onDeleteClick: function() {
        me = this,
        panel = me.getPanel(),
        rowEditing = panel.plugins[0],
        selectionModel = panel.getSelectionModel(),
        selection = selectionModel.getSelection()[0],
        learnLinkStore = me.getLearnLinksStore(),
        title = selection.get('Title'),
        url = selection.get('URL'),
        descriptiveText =  ((title && url) ? title + '(' + url + ')' : title || url) || 'this learn link';

        Ext.Msg.confirm('Are you sure?', 'Are you sure that you want to delete ' + descriptiveText + '?', function(response) {
            if (response === 'yes') {
                rowEditing.cancelEdit();

                learnLinkStore.remove(selection);

                if (learnLinkStore.getCount() > 0) {
                    selectionModel.select(0);
                }
            }
        });
    },

    onAlignClick: function() {
        var me = this,
        panel = me.getPanel(),
        selection = panel.getSelection(),
        standardsPicker;

        selection = Array.isArray(selection) ? selection[0] : null;

        if (selection) {
            standardsPicker = new Ext.create('Spark2Manager.view.StandardPicker', {
                record: selection,
                listeners: {
                    'alignstandards': me.onAlignStandards
                }
            });

            standardsPicker.show();
        }
    },

    onAlignStandards: function(record, standards) {
        record.set('Standards', standards);
        debugger;
    }
});
