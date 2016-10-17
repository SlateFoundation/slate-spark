Ext.define('SparkRepositoryManager.view.apply.Editor', {
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
        'SparkRepositoryManager.plugin.FieldReplicator',
        'SparkRepositoryManager.widget.DurationField',
        'SparkRepositoryManager.field.ApplyLinks'
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

        itemId: 'details-fieldset',

        title:      'Project Details',
        layout:     'anchor',
        flex:       1,
        scrollable: true,

        items: [{
            xtype: 'textarea',
            itemId: 'instructions-textarea',

            readOnly: this.readOnly,
            fieldLabel: 'Instructions',
            labelAlign: 'top',
            grow: true,

            anchor: '100%'

        }, {
            xtype: 'durationfield',
            itemId: 'timeestimate-durationfield',

            readOnly: this.readOnly,

            fieldLabel: 'Time Estimate',
            labelAlign: 'top',

            duration:   0,

            anchor: '100%'

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
                ptype: 's2m-fieldreplicator',
                pluginId: 'fieldreplicator'
            },

            triggerAction: 'all',
            labelAlign:    'top',
            emptyText:     'Type your todo here. When you are done typing, press tab to enter another.',

            onReplicate: function (newField, lastField, cloneField) {
                if (lastField && lastField.isDirty()) {
                    window.setTimeout(function() {
                        newField.focus();
                    }, 5);
                }
            }
        }]
    }, {
        xtype: 'srm-field-applylinks',
        itemId: 'links-fieldset'
    }, {
        xtype: 'textfield',
        id: 'dummy-focus-field'
    }],

    listeners: {
        element: 'el',
        delegate: '.x-field',
        dblclick: function(ev, t) {
            var applyEditor = this.component,
                gridPanel = applyEditor.up('s2m-apply-panel'),
                editingPlugin = gridPanel.editingPlugin,
                record = applyEditor.getRecord(),
                field = Ext.get(t).component;

            if (!editingPlugin.editing && gridPanel.getSelection()[0] == record) {
                editingPlugin.startEdit(record);

                if (field) {
                    field.focus();
                }
            }
        }
    },

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
            linksFieldset.setValues(links);
        }

        // HACK: resetFields manaully sets the nested fields under duration field
        detailsFieldset.down('durationfield').setValue(detailsFieldset.down('durationfield').getValue());

        me.record = rec;
    },

    updateRecord: function() {
        var me = this,
            rec = me.getRecord(),
            instructions = me.down('#instructions-textarea').getValue(),
            timeEstimate = me.down('#timeestimate-durationfield').getValue(),
            todos = me.down('#todos-fieldset').down('textarea').getPlugin('fieldreplicator').getValues(),
            links = me.down('#links-fieldset').getValues();

        if (rec.get('Instructions') !== instructions) {
            rec.set('Instructions', instructions);
        }

        if (rec.get('TimeEstimate') !== timeEstimate) {
            rec.set('TimeEstimate', timeEstimate);
        }

        if (rec.get('Todos') !== todos) {
            rec.set('Todos', todos);
        }

        if (rec.get('Links') !== links) {
            rec.set('Links', links);
        }

    },

    isDirty: function() {
        var me = this,
            rec = me.getRecord(),
            instructions = me.down('#instructions-textarea').getValue(),
            timeEstimate = me.down('#timeestimate-durationfield').getValue(),
            todos = me.down('#todos-fieldset').down('textarea').getPlugin('fieldreplicator').getValues(),
            links = me.down('#links-fieldset');

        if (rec && ((rec.get('Instructions') !== instructions) ||
            (rec.get('TimeEstimate') !== timeEstimate) ||
            (JSON.stringify(rec.get('Todos')) !== JSON.stringify(todos)) ||
            links.isDirty()))
        {
            return true;
        }
        return false;
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
