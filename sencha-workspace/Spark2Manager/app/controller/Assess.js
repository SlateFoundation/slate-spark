Ext.define('Spark2Manager.controller.Assess', {
        requires: [
            'Spark2Manager.store.Assessments',
            'Spark2Manager.store.AssessmentTypes',
            'Spark2Manager.store.Vendors',
            'Spark2Manager.store.VendorDomains',
            'Spark2Manager.view.StandardPicker',
            'Ext.window.MessageBox'
        ],

        extend: 'Ext.app.Controller',

        config: {
            refs: [{
                ref: 'panel',
                selector: 's2m-assess-panel'
            }],

            control: {
                's2m-assess-panel': {
                    activate: 'onPanelActivate'
                },
                's2m-assess-panel button[action=add]': {
                    click: 'onAddClick'
                },
                's2m-assess-panel button[action=delete]': {
                    click: 'onDeleteClick'
                },
                's2m-assess-panel button[action=align]': {
                    click: 'onAlignClick'
                }
            }
        },

        stores: [
        'Assessments',
        'AssessmentTypes',
        'Vendors',
        'VendorDomains'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },

    onPanelActivate: function() {
        this.getVendorsStore().load();
        this.getVendorDomainsStore().load();
        this.getAssessmentsStore().load();
        this.getAssessmentTypesStore().load();
    },

    onAddClick: function() {
        var me = this,
            rowEditing = me.getPanel().getPlugin('rowediting'),
            newLink = me.getAssessmentsStore().insert(0, {});

        if (!rowEditing.editor.isDirty()) {
            rowEditing.startEdit(newLink[0], 0);
        } else {
            Ext.Msg.alert('Unsaved changes', 'You must save or cancel your changes before creating a new assessment.');
        }
    },

    onDeleteClick: function() {
        var me = this,
            panel = me.getPanel(),
            rowEditing = panel.plugins[0],
            selectionModel = panel.getSelectionModel(),
            selection = selectionModel.getSelection()[0],
            assessmentsStore = me.getAssessmentsStore(),
            url = selection.get('URL'),
            descriptiveText = url || 'this assessment';

        Ext.Msg.confirm('Are you sure?', 'Are you sure that you want to delete ' + descriptiveText + '?', function(response) {
            if (response === 'yes') {
                rowEditing.cancelEdit();

                assessmentsStore.remove(selection);

                if (assessmentsStore.getCount() > 0) {
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
