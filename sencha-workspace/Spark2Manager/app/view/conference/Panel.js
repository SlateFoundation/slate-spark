Ext.define('Spark2Manager.view.conference.Panel', {
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.selection.CellModel',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.button.Button',
        'Ext.toolbar.Paging'
    ],

    extend: 'Ext.grid.Panel',

    xtype: 's2m-conference-panel',

    store: 'GuidingQuestions',

    bbar: [
        { xtype: 'button', text: 'Add Guiding Question', action: 'create-guiding-question' }
    ],

    columns: [
        {
            text: 'Question',
            dataIndex: 'Question',
            flex: 1,
            editor: {
                xtype: 'textarea',
                allowBlank: false
            }
        },
        {
            text: 'Created By',
            dataIndex: 'CreatorFullName',
            flex: 1
        },
        {
            text: 'Created',
            dataIndex: 'Created',
            flex: 1
        }
    ],

    // TODO: Order by created by me, date created, creator

    selModel: 'cellmodel',

    plugins: {
        ptype: 'cellediting',
        pluginId: 'cellediting',
        clicksToEdit: 1
    },

    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'GuidingQuestions',
        dock: 'bottom',
        displayInfo: true
    }]
});
