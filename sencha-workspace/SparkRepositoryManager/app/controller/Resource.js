/**
 * The Resource controller manages the Conference Resources section of the application where
 * staff can add, edit and delete resources, and align resources to standards
 *
 * ## Responsibilities
 * - Add conference resources
 * - Delete conference resources
 * - Align conference resources to standards
 * - Show align button when standards column is visible
 */
Ext.define('SparkRepositoryManager.controller.Resource', {
    extend: 'Ext.app.Controller',
    requires: [
        'SparkRepositoryManager.store.Vendors',
        'SparkRepositoryManager.store.VendorDomains',
        'SparkRepositoryManager.store.ConferenceResources',
        'SparkRepositoryManager.view.StandardPicker',
        'Ext.window.MessageBox'
    ],


    // dependencies
    stores: [
        'ConferenceResources',
        'Vendors',
        'VendorDomains'
    ],


    // component references
    refs: [{
        ref: 'panel',
        selector: 's2m-resource-panel'
    }, {
        ref: 'alignButton',
        selector: 's2m-resource-panel button[action=align]'
    }, {
        ref: 'alignButtonSeparator',
        selector: 's2m-resource-panel tbseparator#alignButtonSeparator'
    }],


    // entry points
    control: {
        's2m-resource-panel': {
            activate: 'onPanelActivate',
            columnhide: 'onPanelColumnHide',
            columnshow: 'onPanelColumnShow'
        },
        's2m-resource-panel button[action=add]': {
            click: 'onAddClick'
        },
        's2m-resource-panel button[action=delete]': {
            click: 'onDeleteClick'
        },
        's2m-resource-panel button[action=align]': {
            click: 'onAlignClick'
        }
    },


    // event handlers
    onPanelActivate: function() {
        var conferenceResourcesStore = this.getConferenceResourcesStore();

        if (!conferenceResourcesStore.isLoaded() || !conferenceResourcesStore.isLoading()) {
            conferenceResourcesStore.load();
        }
    },

    onAddClick: function() {
        var me = this,
            rowEditing = me.getPanel().getPlugin('rowediting'),
            rec = rowEditing.editing ? rowEditing.getEditor().getRecord() : null,
            newRecord;

        if (rec !== null && (rowEditing.getEditor().isDirty() || rec.phantom)) {
            Ext.Msg.alert('Unsaved changes', 'You must save or cancel your changes before creating a new assessment.');
        } else {
            newRecord = me.getConferenceResourcesStore().insert(0, {});
            rowEditing.startEdit(newRecord[0], 0);
        }
    },

    onDeleteClick: function() {
        var me = this,
            panel = me.getPanel(),
            rowEditing = panel.plugins[0],
            selectionModel = panel.getSelectionModel(),
            selection = selectionModel.getSelection()[0],
            ConferenceResourcesStore = me.getConferenceResourcesStore(),
            url = selection.get('URL'),
            descriptiveText = url || 'this assessment';

        Ext.Msg.confirm('Are you sure?', 'Are you sure that you want to delete ' + descriptiveText + '?', function(response) {
            if (response === 'yes') {
                rowEditing.cancelEdit();

                ConferenceResourcesStore.remove(selection);

                if (ConferenceResourcesStore.getCount() > 0) {
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
    },

    onPanelColumnHide: function(grid, column) {
        var me = this;

        if (column.getXType()==='srm-standardslistcolumn') {
            me.getAlignButton().hide();
            me.getAlignButtonSeparator().hide();
        }
    },

    onPanelColumnShow: function(grid, column) {
        var me = this;

        if (column.getXType()==='srm-standardslistcolumn') {
            me.getAlignButton().show();
            me.getAlignButtonSeparator().show();
        }
    }
});
