Ext.define('Spark2Manager.view.apply.Panel', {

    extend: 'Ext.form.Panel',

    requires: [,
        'Spark2Manager.store.ApplyProjects',
        'Spark2Manager.view.apply.Editor',
        'Ext.grid.Panel',
        'Ext.grid.plugin.CellEditing',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Toolbar',
        'Ext.layout.container.HBox',
        'Ext.grid.Panel',
        'Ext.container.Container',
        'Ext.util.Format'
    ],

    xtype: 's2m-apply-panel',

    stores: [
        'ApplyProjects'
    ],

    layout: {
        type:  'hbox',
        align: 'stretch'
    },

    items: [{
        flex:            3,
        xtype:           'gridpanel',
        modelValidation: false,
        store:           'ApplyProjects',

        dockedItems: [{
            id:          'pagingtoolbar',
            xtype:       'pagingtoolbar',
            store:       'ApplyProjects',
            dock:        'bottom',
            displayInfo: true
        }, {
            xtype: 'container',

            id: 'editorcontainer',

            dock:    'right',

            scrollable: true,

            items: [{
                xtype: 'toolbar',
                id:    'gridtoolbar',
                items: [{
                    text:    'Add Project',
                    tooltip: 'Add a new project',
                    action:  'add'
                }, '-', {
                    text:     'Align to Standards',
                    tooltip:  'Align this link to multiple standards easily using the standards picker',
                    action:   'align',
                    disabled: true
                }, '-', {
                    text:     'Delete Project',
                    tooltip:  'Remove the selected project',
                    action:   'delete',
                    disabled: true
                }]
            }, {
                padding: 10,
                width: 350,
                xtype: 's2m-apply-editor',
                disabled: true
            }]
        }],

        columns:   [{
            text:      'Project Title',
            flex:      2,
            sortable:  true,
            dataIndex: 'Title',
            msgTarget: 'under',
            editor:    {
                xtype:      'textfield',
                allowBlank: false
            }
        }, {
            text:      'Instructions',
            flex:      3,
            sortable:  true,
            dataIndex: 'Instructions',
            editor:    {
                xtype:      'textarea',
                allowBlank: false,
                msgTarget:  'under'
            }
        }, {
            text:      'Grade',
            dataIndex: 'GradeLevel',
            width:     60,
            editor:    {
                xtype:    'combobox',
                store:    ['PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                editable: false,
                grow:     true
            }
        }, {
            text:      'DOK',
            dataIndex: 'DOK',
            editor:    {
                xtype: 'combobox',
                store: [1, 2, 3, 4]
            },
            width:     50
        }],
        listeners: {
            selectionchange: function (model, records) {
                var me = this,
                    panel  = me.findParentByType('s2m-apply-panel'),
                    editorContainer = me.down('#editorcontainer'),
                    editor = me.down('s2m-apply-editor'),
                    pagingToolbar = me.down('pagingtoolbar'),
                    rec = records ? records[0] : null,
                    hasRecords = records.length === 0;

                me.down('#gridtoolbar button[action="delete"]').setDisabled(hasRecords);
                me.down('#gridtoolbar button[action="align"]').setDisabled(hasRecords);
                editor.setDisabled(hasRecords);

                if (rec) {
                    /* detailPanel.setTitle(rec.get('Title'));
                    detailsForm.loadRecord(rec); */
                    pagingToolbar.displayMsg = 'Displaying {0} - {1} of {2} - ' + rec.get('Title') + ' created by ' + rec.get('CreatorFullName') + ' on ' + Ext.util.Format.date(rec.get('Created'), 'm-d-y');
                    pagingToolbar.updateInfo();
                    editor.setRecord(rec);
                }
            }
        },

        plugins: {
            ptype:        'cellediting',
            pluginId:     'cellediting',
            clicksToEdit: 1,
            errorSummary: false
        },

        selMode: 'row'
    }]
});