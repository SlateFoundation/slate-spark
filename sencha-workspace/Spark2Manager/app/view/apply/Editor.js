Ext.define('Spark2Manager.view.apply.Editor', {
    requires: [
        'Spark2Manager.widget.DurationField',
        'Spark2Manager.plugin.FieldReplicator',

        'Ext.form.Panel',
        'Ext.layout.container.Anchor',
        'Ext.form.FieldSet',
        'Ext.layout.container.VBox',
        'Ext.form.field.TextArea',

        'Ext.form.TextField',
        'Ext.form.field.Tag',
        'Ext.Array',
        'Ext.layout.container.Fit',
        'Ext.data.ArrayStore',
        'Ext.grid.plugin.RowEditing'
    ],
    extend:   'Ext.panel.Panel',

    xtype: 's2m-apply-editor',

    config: {
        layout:     {
            type: 'vbox',
            align: 'stretch'
        },
        scrollable: true,
        record: null
    },

    items: [{
        xtype: 'fieldset',

        id: 'details-fieldset',

        title:      'Project Details',
        layout:     'anchor',
        flex:       1,
        scrollable: true,

        items: [{
            xtype: 'textarea',

            fieldLabel: 'Instructions',
            labelAlign: 'top',

            anchor: '100%'
        }, {
            xtype:      'durationfield',

            fieldLabel: 'Time Estimate',
            labelAlign: 'top',

            duration:   90,

            anchor: '100%'
        }]
    }, {
        xtype: 'fieldset',

        id: 'todos-fieldset',

        title:      'Todos',
        layout:     'anchor',
        padding:    10,
        flex:       1,
        scrollable: true,

        defaultType: 'textarea',

        items: [{
            xtype: 'textarea',
            anchor: '100%',
            plugins: {
                ptype: 'fieldreplicator',
                pluginId: 'fieldreplicator'
            },
            triggerAction: 'all',
            labelAlign:    'top',
            emptyText:     'Type your todo here. When you are done typing, press tab to enter another.',
            listeners: {
                blur: function() {
                    var me = this,
                        rowediting,
                        record,
                        newVal,
                        curVal;

                    // TODO: isDirty doesn't work quite the way we want here, originalValues and the fieldreplicator
                    // may not play nice.

                    if (me.isDirty() && me.getValue() != '') {
                        rowediting = me.findParentByType('gridpanel').getPlugin('rowediting');
                        record = rowediting.editor.getRecord();
                        newVal = me.getPlugin('fieldreplicator').getValues();
                        curVal = record.get('Todos');

                        // HACK: Do not save if no changes have occurred
                        if (newVal.length !== curVal.length || JSON.stringify(newVal) !== JSON.stringify(curVal)) {
                            record.set('Todos', newVal);
                        }
                    }
                }
            }
        }]
    }, {
        xtype: 'fieldset',

        id: 'links-fieldset',

        title:       'Links',
        layout:      'anchor',
        defaultType: 'textfield',
        padding:     10,
        flex:        1,
        scrollable:  true,

        items: [{
            xtype: 'textfield',
            anchor: '100%',
            plugins: {
                ptype: 'fieldreplicator',
                pluginId: 'fieldreplicator'
            },
            triggerAction: 'all',
            labelAlign:    'top',
            emptyText:     'Enter your link URL here. Press tab to enter another.',
            listeners: {
                blur: function() {
                    var me = this,
                        rowediting,
                        record,
                        newVal,
                        curVal;

                    // TODO: isDirty doesn't work quite the way we want here, originalValues and the fieldreplicator
                    // may not play nice.

                    if (me.isDirty() && me.getValue() != '') {
                        rowediting = me.findParentByType('gridpanel').getPlugin('rowediting');
                        record = rowediting.editor.getRecord();
                        newVal = me.getPlugin('fieldreplicator').getValues();
                        curVal = record.get('Links');

                        // HACK: Do not save if no changes have occurred
                        if (newVal.length !== curVal.length || JSON.stringify(newVal) !== JSON.stringify(curVal)) {
                            record.set('Links', newVal);
                        }
                    }
                }
            }
        }]
    }],

    applyRecord: function(rec) {
        var me              = this,
            detailsFieldset = me.down('#details-fieldset'),
            links           = rec.get('Links'),
            todos           = rec.get('Todos');

        detailsFieldset.setTitle(rec.get('Title'));

        if (Array.isArray(todos)) {
            todosFieldset.down('textarea').getPlugin('fieldreplicator').setValues(todos);
        }

        if (Array.isArray(links)) {
            todosFieldset.down('textarea').getPlugin('fieldreplicator').setValues(links);
        }
    }
});