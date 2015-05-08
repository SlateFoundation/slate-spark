Ext.define('Spark2Manager.view.assess.Panel', {
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.ComboBox',
        'Ext.button.Button',
        'Ext.form.field.Tag',
        'Ext.toolbar.Paging'
    ],

    extend: 'Ext.grid.Panel',

    xtype: 's2m-assess-panel',

    store: 'Assessments',

    bbar: [
        { xtype: 'button', text: 'Add Assessment', action: 'create-assessment' }
    ],

    columns: [
        {
            text: 'Standard',
            width: 250,
            dataIndex: 'code',
            editor: {
                reference: 'standards',
                xtype: 'tagfield',
                store: 'StandardCodes',
                queryMode: 'local',
                displayField: 'code',
                valueField: 'code',
                allowBlank: false,
                filterPickList: true,
                multiSelect: true
            }
        },
        {
            text: 'Type',
            dataIndex: 'AssessmentTypeID',
            flex: 1,
            editor: {
                xtype: 'combobox',
                store: 'AssessmentTypes',
                queryMode: 'local',
                displayField: 'Name',
                valueField: 'ID',
                grow: true,
                editable: false,
                allowBlank: false,
                emptyText: '',
                value: ''
            },
            renderer: function(val, col, record) {
                // HELP: @themightychris: is there an easier way to do this sort of thing?
                var assessmentType = Ext.getStore('AssessmentTypes').getById(val);

                if (assessmentType) {
                    return assessmentType.get('Name');
                }

                return '';
            }
        }
    ],

    selModel: 'cellmodel',

    plugins: {
        ptype: 'cellediting',
        pluginId: 'cellediting',
        clicksToEdit: 1
    },

    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'Assessments',
        dock: 'bottom',
        displayInfo: true
    }]
});
