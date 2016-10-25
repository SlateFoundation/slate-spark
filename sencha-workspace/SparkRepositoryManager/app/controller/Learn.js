Ext.define('SparkRepositoryManager.controller.Learn', {
    requires: [
        'SparkRepositoryManager.store.LearnLinks',
        'SparkRepositoryManager.store.Vendors',
        'SparkRepositoryManager.store.VendorDomains',
        'SparkRepositoryManager.view.StandardPicker',
        'Ext.window.MessageBox'
    ],
    extend: 'Ext.app.Controller',

    config: {
        refs: [{
            ref: 'panel',
            selector: 's2m-learn-panel'
        }, {
            ref: 'gridpanel',
            selector: 's2m-learn-panel gridpanel'
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
        window.me = this;
    },

    onPanelActivate: function() {
        this.stores.forEach(function(store) {
            store = Ext.getStore(store.split('.').pop());

            if (!(store.isLoaded() || store.isLoading())) {
                store.load();
            }
        });
    },

    onAddClick: function() {
        var me = this,
            rowEditing = me.getPanel().getPlugin('rowediting'),
            rec = rowEditing.editing ? rowEditing.getEditor().getRecord() : null,
            newRecord;

        if (rec !== null && (rowEditing.getEditor().isDirty() || rec.phantom)) {
            Ext.Msg.alert('Unsaved changes', 'You must save or cancel your changes before creating a new learn.');
        } else {
            newRecord = me.getLearnLinksStore().insert(0, {});
            rowEditing.startEdit(newRecord[0], 0);
        }
    },

    onDeleteClick: function() {
        var me = this,
        panel = me.getPanel(),
        rowEditing = panel.getPlugin('rowediting'),
        selectionModel = panel.getSelectionModel(),
        selection = selectionModel.getSelection()[0],
        learnLinkStore = me.getLearnLinksStore(),
        title = selection.get('Title'),
        url = selection.get('URL'),
        descriptiveText = ((title && url) ? title + '(' + url + ')' : title || url) || 'this learn link'; // eslint-disable-line no-extra-parens

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
            record = panel.getSelection()[0],
            standards,
            standardsPicker;

        if (isEditing) {
            standards = editor.down('spark-standardfield').getValue();
        } else {
            standards = record.get('StandardIDs');
        }

        standardsPicker = Ext.create('SparkRepositoryManager.view.StandardPicker', {
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
            isEditing = rowEditing.editing;

        if (isEditing) {
            editor.down('spark-standardfield').setValue(standards);
        } else {
            record = panel.getSelection()[0];
            record.set('StandardIDs', standards);
        }
    }
});
