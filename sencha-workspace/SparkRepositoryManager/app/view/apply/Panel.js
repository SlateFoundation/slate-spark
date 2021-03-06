Ext.define('SparkRepositoryManager.view.apply.Panel', {
    extend: 'Ext.grid.Panel',
    xtype: 's2m-apply-panel',
    requires: [
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.form.field.Tag',
        'Ext.form.field.Text',
        'Ext.grid.column.Date',
        'Ext.grid.plugin.RowEditing',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Separator',
        'Ext.toolbar.Toolbar',
        'Ext.util.Format',
        'Ext.window.MessageBox',
        'SparkRepositoryManager.proxy.Records',
        'SparkRepositoryManager.store.ApplyProjects',
        'SparkRepositoryManager.view.apply.Editor',
        'SparkRepositoryManager.column.StandardsList'
    ],


    modelValidation: false,
    store: 'ApplyProjects',

    dockedItems: [{
        xtype: 's2m-apply-editor',
        dock: 'right',
        bodyPadding: 10,
        width: 500,
        readOnly: true,
        disabled: true,
        scrollable: false
    }, {
        xtype: 'pagingtoolbar',
        store: 'ApplyProjects',
        dock: 'bottom',
        displayInfo: true
    }, {
        xtype: 'toolbar',
        itemId: 'gridtoolbar',
        items: [{
            text: 'Add Apply',
            tooltip: 'Add a new apply',
            action: 'add'
        },
        {
            xtype: 'tbseparator'
        },
        {
            text: 'Align to Standards',
            tooltip: 'Align this link to multiple standards easily using the standards picker',
            action: 'align',
            hidden: true,
            disabled: true
        },
        {
            xtype: 'tbseparator',
            itemId: 'alignButtonSeparator',
            hidden: true
        },
        {
            text: 'Delete Apply',
            tooltip: 'Remove the selected apply',
            action: 'delete',
            disabled: true
        }]
    }],

    columns: [{
        text: 'Apply Title',
        flex: 2,
        sortable: true,
        dataIndex: 'Title',
        filterField: true,
        msgTarget: 'under',
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
    }, {
        xtype: 'srm-standardslistcolumn',
        hidden: true
    }, {
        text: 'Grade',
        dataIndex: 'GradeLevel',
        width: 60,

        filterField: {
            xtype: 'combobox',
            store: ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            editable: false,
            grow: true
        },

        editor: {
            xtype: 'combobox',
            store: ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            editable: false,
            grow: true
        }
    }, {
        text: 'DOK',
        dataIndex: 'DOK',

        filterField: {
            xtype: 'combobox',
            store: [1, 2, 3, 4],
            editable: false,
            grow: true
        },

        editor: {
            xtype: 'combobox',
            store: [1, 2, 3, 4],
            editable: false,
            grow: true
        }
    }, {
        text: 'Created By',
        dataIndex: 'CreatorFullName',
        sortable: false,
        filterField: {
            xtype: 'combobox',
            store: {
                xclass: 'Ext.data.Store',

                proxy: {
                    type: 'spark-api',
                    url: '/spark2/apply-projects/*creators'
                },

                fields: ['ID', 'FullName']
            },
            queryMode: 'local',
            displayField: 'FullName',
            valueField: 'ID',
            editable: false,
            grow: true
        }
    }, {
        xtype: 'datecolumn',
        format: 'm-d-Y',
        text: 'Created',
        dataIndex: 'Created',

        filterField: {
            xtype: 'datefield',
            format: 'm-d-Y'
        }
    }],

    listeners: {
        beforeselect: function (model, record) {
            var me = this,
                editor = me.down('s2m-apply-editor'),
                rowediting = me.getPlugin('rowediting'),
                isEditing = record && rowediting.editing;

            me.down('#gridtoolbar button[action="delete"]').setDisabled(!record);
            me.down('#gridtoolbar button[action="align"]').setDisabled(!record);
            editor.setDisabled(!record);

            if (isEditing && (me.editingPlugin.editor.getForm().isDirty() || editor.isDirty())) {
                Ext.Msg.confirm(
                    'Unsaved Changes',
                    'Discard any unsaved changes on current apply?',
                    function(response) {
                        if (response === 'yes') {
                            rowediting.cancelEdit();
                            me.getSelectionModel().select(record);
                        }
                    });
                return false;
            }
            rowediting.cancelEdit();
            return true;
        },

        selectionchange: function (model, records) {
            var me = this,
                editor = me.down('s2m-apply-editor'),
                rowediting = me.getPlugin('rowediting'),
                rec = records ? records[0] : null;

            editor.setRecord(rec);
            editor.setReadOnly(!rowediting.editing);
        }
    },

    plugins: [{
        ptype: 'rowediting',
        pluginId: 'rowediting',
        clicksToEdit: 2,
        errorSummary: true,
        autoCancel: false
    }]
});
