Ext.define('Spark2Manager.controller.Assess', {
        requires: [
            'Spark2Manager.store.Assessments',
            'Spark2Manager.store.AssessmentTypes',
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
            rowEditing = me.getPanel().plugins[0], // I used to be able to do getPlugin('cellediting') but not w/ row
            newLink = me.getAssessmentsStore().insert(0, {});

        rowEditing.cancelEdit();
        rowEditing.startEdit(newLink[0], 0);
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
            selection = panel.getSelection(),
            standardsPicker;

        selection = Array.isArray(selection) ? selection[0] : null;

        if (selection) {
            standardsPicker = new Ext.create('Spark2Manager.view.StandardPicker', {
                record: selection
            });

            standardsPicker.show();
        }
    }
});
