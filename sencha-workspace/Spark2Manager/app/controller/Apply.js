Ext.define('Spark2Manager.controller.Apply', {
    requires: [
        'Ext.tip.QuickTipManager',
        'Ext.window.MessageBox',
        'Spark2Manager.store.ApplyProjects',
        'Spark2Manager.view.StandardPicker'
    ],

    extend: 'Ext.app.Controller',

    refs: [{
            ref:      'panel',
            selector: 's2m-apply-panel'
        }, {
           ref:      'gridpanel',
           selector: 's2m-apply-panel gridpanel'
    }],

    config: {
        control: {
            's2m-apply-panel': {
                activate: 'onPanelActivate'
            },
            's2m-apply-panel button[action=add]': {
                click: 'onAddClick'
            },
            's2m-apply-panel button[action=delete]': {
                click: 'onDeleteClick'
            },
            's2m-apply-panel button[action=align]': {
                click: 'onAlignClick'
            }
        }
    },

    stores: [
        'ApplyProjects'
    ],

    /**
     * Called when the view is created
     */
    init: function() {
        Ext.tip.QuickTipManager.init();
        Ext.tip.QuickTipManager.disable();
    },

    onPanelActivate: function() {
        this.getApplyProjectsStore().load();
    },

    onAddClick: function() {
        var me = this,
            panel = me.getPanel(),
            plugin = panel.down('gridpanel').getPlugin('rowediting'),
            editor = panel.down('s2m-apply-editor'),
            rec = plugin.getEditor().getRecord(),
            newApplyProject;

        if (typeof rec !== 'undefined' && (rec === null || rec.phantom || plugin.getEditor().isDirty())) {
            Ext.Msg.alert('Unsaved changes', 'You must save or cancel your changes before creating a new Apply.');
        } else {
            newApplyProject = me.getApplyProjectsStore().insert(0, {});
            plugin.startEdit(newApplyProject[0], 0);
            editor.setRecord(newApplyProject[0]);
        }
    },

    onDeleteClick: function() {
        var me = this,
            panel = me.getPanel().down('gridpanel'),
            rowEditing = panel.getPlugin('rowediting'),
            selectionModel = panel.getSelectionModel(),
            selection = selectionModel.getSelection()[0],
            applyProjectsStore = me.getApplyProjectsStore(),
            title = selection.get('Title'),
            descriptiveText =  title || 'this apply project',
            editor = panel.up().down('s2m-apply-editor');

        Ext.Msg.confirm('Are you sure?', 'Are you sure that you want to delete ' + descriptiveText + '?', function(response) {
            if (response === 'yes') {
                rowEditing.cancelEdit();

                applyProjectsStore.remove(selection);

                if (applyProjectsStore.getCount() > 0) {
                    selectionModel.select(0);
                }

                editor.setReadOnly(true);
            }
        });
    },

    onAlignClick: function() {
        var me = this,
            panel = me.getPanel().down('gridpanel'),
            rowEditing = panel.getPlugin('rowediting'),
            editor = rowEditing.getEditor(),
            isEditing = rowEditing.editing,
            tagField,
            record = panel.getSelection()[0],
            standards,
            standardsPicker;

        if (isEditing) {
            tagField = editor.down('tagfield');
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
            panel = me.getGridpanel(),
            rowEditing = panel.getPlugin('rowediting'),
            editor = rowEditing.getEditor(),
            isEditing = rowEditing.editing,
            tagField = editor.down('tagfield'),
            record;

        if (isEditing) {
            tagField = editor.down('tagfield');
            tagField.setValue(standards.map(function(standard) {
                return standard.standardCode;
            }));
        } else {
            record = panel.getSelection()[0];
            record.set('Standards', standards);
        }
    }
});
