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
                activate: 'onPanelActivate'
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
        var me = this,
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
            rowEditing = panel.getPlugin('rowediting'),
            editor = rowEditing.getEditor(),
            isEditing = rowEditing.editing,
            tagField,
            record = panel.getSelection()[0],
            standards,
            standardsPicker;

        if (isEditing) {
            tagField = editor.getRefItems()[0];
            standards = tagField.getValue().map(function(standard) {
                return standard.standardCode ? standard : { standardCode: standard };
            });
        } else {
            standards = record.get('Standards');
        }

        standardsPicker = new Ext.create('Spark2Manager.view.StandardPicker', {
            standards: standards,
            record: record,
            listeners: {
                'alignstandards': 'onAlignStandards',
                scope: me
            }
        });

        standardsPicker.show();
    },

    onAlignStandards: function(record, standards) {
        var me = this,
            panel = me.getPanel(),
            rowEditing = panel.getPlugin('rowediting'),
            editor = rowEditing.getEditor(),
            isEditing = rowEditing.editing,
            store = me.getLearnLinksStore(),
            tagField,
            record;

        if (isEditing) {
            // HACK: @themightychris what's a better way to get a reference to the tagfield in the roweditor?
            tagField = editor.getRefItems()[0];
            tagField.setValue(standards.map(function(standard) {
                return standard.standardCode;
            }));
        } else {
            record = panel.getSelection()[0];
            record.set('Standards', standards);
        }
    }
});
