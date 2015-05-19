Ext.define('Spark2Manager.view.apply.Editor', {
    requires: [
        'Ext.Array',
        'Ext.ComponentQuery',
        'Ext.container.Container',
        'Ext.data.ArrayStore',
        'Ext.form.FieldSet',
        'Ext.form.Panel',
        'Ext.form.TextField',
        'Ext.form.field.Tag',
        'Ext.form.field.TextArea',
        'Ext.grid.plugin.RowEditing',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Fit',
        'Ext.layout.container.VBox',
        'Spark2Manager.plugin.FieldReplicator',
        'Spark2Manager.widget.DurationField'
    ],
    extend:   'Ext.panel.Panel',

    xtype: 's2m-apply-editor',

    config: {
        layout:     {
            type: 'vbox',
            align: 'stretch'
        },
        record: null,
        readOnly: false
    },

    padding: 5,

    items: [{
        xtype: 'fieldset',

        id: 'details-fieldset',

        title:      'Project Details',
        layout:     'anchor',
        flex:       1,
        scrollable: true,

        items: [{
            xtype: 'textarea',

            readOnly: this.readOnly,
            fieldLabel: 'Instructions',
            labelAlign: 'top',
            grow: true,
            
            anchor: '100%',

            listeners: {
                'blur': function() {
                    var me = this,
                        rowediting,
                        record,
                        newVal,
                        curVal;

                    if (!me.readOnly && me.isDirty()) {
                        rowediting = Ext.getCmp('s2m-apply-gridpanel').getPlugin('rowediting');
                        record = rowediting.editor.getRecord();
                        newVal = me.getValue();
                        curVal = record.get('Instructions');

                        // HACK: Do not save if no changes have occurred
                        if (newVal != curVal) {
                            record.set('Instructions', newVal);
                        }
                    }
                }
            }
        }, {
            xtype:      'durationfield',

            readOnly: this.readOnly,

            fieldLabel: 'Time Estimate',
            labelAlign: 'top',

            duration:   0,

            anchor: '100%',

            listeners: {
                'blur': function() {
                    var me = this,
                        rowediting,
                        record,
                        newVal,
                        curVal;

                    if (!me.readOnly) {
                        rowediting = Ext.getCmp('s2m-apply-gridpanel').getPlugin('rowediting');
                        record = rowediting.editor.getRecord();

                        if (!record) {
                            return;
                        }

                        newVal = me.getValue();
                        curVal = record.get('TimeEstimate');

                        // HACK: Do not save if no changes have occurred
                        if (newVal != curVal) {
                            record.set('TimeEstimate', newVal);
                        }
                    }
                }
            }
        }]
    }, {
        xtype: 'fieldset',

        id: 'todos-fieldset',

        title:      'Todos',
        flex:       1,
        scrollable: true,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },

        defaultType: 'textarea',

        items: [{
            xtype: 'textarea',

            readOnly: this.readOnly,

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

                    if (!me.readOnly && me.isDirty() && me.getValue() != '') {
                        rowediting = Ext.getCmp('s2m-apply-gridpanel').getPlugin('rowediting');
                        record = rowediting.editor.getRecord();
                        newVal = me.getPlugin('fieldreplicator').getValues();
                        curVal = record.get('Todos') || [];

                        // HACK: Do not save if no changes have occurred
                        if (newVal.length !== curVal.length || JSON.stringify(newVal) !== JSON.stringify(curVal)) {
                            record.set('Todos', newVal);
                        }
                    }
                }
            },

            onReplicate: function (newField, lastField, cloneField) {
                if (lastField && lastField.isDirty()) {
                    window.setTimeout(function() {
                        console.log('setting focus');
                        newField.focus();
                    }, 10);
                }
            }
        }]
    }, {
        xtype: 'fieldset',

        id: 'links-fieldset',

        title:       'Links',
        defaultType: 'textfield',
        flex:        1,
        scrollable:  true,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },

        items: [{
            xtype: 'textfield',

            readOnly: this.readOnly,

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

                    if (!me.readOnly && me.isDirty() && me.getValue() != '') {
                        rowediting = Ext.getCmp('s2m-apply-gridpanel').getPlugin('rowediting');
                        record = rowediting.editor.getRecord();
                        newVal = me.getPlugin('fieldreplicator').getValues();
                        curVal = record.get('Links') || [];

                        // HACK: Do not save if no changes have occurred
                        if (newVal.length !== curVal.length || JSON.stringify(newVal) !== JSON.stringify(curVal)) {
                            record.set('Links', newVal);
                        }
                    }
                }
            },

            onReplicate: function (newField, lastField, cloneField) {
                console.log('onReplicate');

                if (lastField && lastField.isDirty()) {
                    window.setTimeout(function() {
                        console.log('setting focus');
                        newField.focus();
                    }, 10);
                }
            }
        }]
    }, {
        xtype: 'textfield',
        id: 'dummy-focus-field'
    }],

    listeners: [{
        el: {
            dblclick: function(e, el) {
                var applyEditor = Ext.getCmp('s2m-apply-editor'),
                    gridpanel, editingPlugin, record;

                if (el.classList.contains('x-form-field')) {
                    gridpanel = Ext.getCmp('s2m-apply-gridpanel');
                    editingPlugin = gridpanel.editingPlugin;

                    if (!editingPlugin.editing) {
                        record = applyEditor.getRecord();

                        // Sanity check, do the records for the right panel and row editor match
                        if (gridpanel.getSelection()[0] == record) {
                            editingPlugin.startEdit(record);
                            this.component.focus();
                        }
                    }
                }
            }
        }
    }],

    applyRecord: function(rec) {
        var me              = this,
            detailsFieldset = me.down('#details-fieldset'),
            linksFieldset   = me.down('#links-fieldset'),
            todosFieldset   = me.down('#todos-fieldset'),
            links = [],
            todos = [],
            title = 'Project Details';

        me.resetFields();

        if (rec) {
            if (rec.phantom) {
                me.setReadOnly(false);
            }

            title = rec.get('Title');
            links = rec.get('Links') || [];
            todos = rec.get('Todos') || [];

            detailsFieldset.down('textfield').setValue(rec.get('Instructions'));
            detailsFieldset.down('durationfield').setValue(rec.get('TimeEstimate'));
        }

        detailsFieldset.setTitle(title);

        if (Array.isArray(todos)) {
            todosFieldset.down('textarea').getPlugin('fieldreplicator').setValues(todos);
        }

        if (Array.isArray(links)) {
            linksFieldset.down('textfield').getPlugin('fieldreplicator').setValues(links);
        }

        // HACK: resetFields manaully sets the nested fields under duration field
        detailsFieldset.down('durationfield').setValue(detailsFieldset.down('durationfield').getValue());

        me.record = rec;
    },

    applyReadOnly: function(val) {
        if (!this.isDisabled()) {
            this.query('field').forEach(function(field) {
                field.setReadOnly(val);
            });
        }
    },

    resetFields: function() {
        this.query('field').forEach(function(field) {
            field.setValue(null);
        });
    }
});