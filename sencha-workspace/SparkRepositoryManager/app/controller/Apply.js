Ext.define('SparkRepositoryManager.controller.Apply', {
    requires: [
        'Ext.window.MessageBox',
        'SparkRepositoryManager.store.ApplyProjects',
        'SparkRepositoryManager.view.StandardPicker'
    ],

    extend: 'Ext.app.Controller',

    refs: [{
        ref:      'panel',
        selector: 's2m-apply-panel'
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

    onPanelActivate: function() {
        this.stores.forEach(function(store) {
            store = Ext.getStore(store);

            if (!(store.isLoaded() || store.isLoading())) {
                store.load();
            }
        });
    },

    onAddClick: function() {
        var me = this,
            panel = me.getPanel(),
            rowEditing = panel.getPlugin('rowediting'),
            editor = panel.down('s2m-apply-editor'),
            rec = rowEditing.editing ? rowEditing.getEditor().getRecord() : null,
            newApplyProject;

        if (rec !== null && (rowEditing.getEditor().isDirty() || rec.phantom)) {
            Ext.Msg.alert('Unsaved changes', 'You must save or cancel your changes before creating a new Apply.');
        } else {
            newApplyProject = me.getApplyProjectsStore().insert(0, {});
            rowEditing.startEdit(newApplyProject[0], 0);
            editor.setRecord(newApplyProject[0]);
        }
    },

    onDeleteClick: function() {
        var me = this,
            panel = me.getPanel(),
            rowEditing = panel.getPlugin('rowediting'),
            selectionModel = panel.getSelectionModel(),
            selection = selectionModel.getSelection()[0],
            applyProjectsStore = me.getApplyProjectsStore(),
            title = selection.get('Title'),
            descriptiveText =  title || 'this apply project',
            editor = panel.down('s2m-apply-editor');

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
            panel = me.getPanel(),
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
            standards = record.get('StandardIDs');
        }

        standardsPicker = Ext.create('SparkRepositoryManager.view.StandardPicker', {
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
            tagField = editor.down('tagfield');

        if (isEditing) {
            tagField = editor.down('tagfield');
            tagField.setValue(standards.map(function(standard) {
                return standard.standardCode;
            }));
        } else {
            record = panel.getSelection()[0];
            record.set('StandardIDs', standards);
        }
    }
});
