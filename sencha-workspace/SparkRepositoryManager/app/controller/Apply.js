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
    },{
        ref:      'editor',
        selector: 's2m-apply-editor'
    }],

    config: {
        control: {
            's2m-apply-panel': {
                activate: 'onPanelActivate',
                beforeedit: 'onPanelBeforeEdit',
                edit: 'onPanelEdit',
                canceledit: 'onPanelCancelEdit',
                validateedit: 'onPanelValidateEdit'
            },
            's2m-apply-panel button[action=add]': {
                click: 'onAddClick'
            },
            's2m-apply-panel button[action=delete]': {
                click: 'onDeleteClick'
            },
            's2m-apply-panel button[action=align]': {
                click: 'onAlignClick'
            },
            // TODO improve this component query... itemId on fieldset?
            's2m-apply-editor fieldset[title="Links"] field': {
                blur: 'onLinkBlur'
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
            record = panel.getSelection()[0],
            standards,
            standardsPicker;

        if (isEditing) {
            standards = editor.down('spark-standardfield').getValue();
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
            isEditing = rowEditing.editing;

        if (isEditing) {
            editor.down('spark-standardfield').setValue(standards);
        } else {
            record = panel.getSelection()[0];
            record.set('StandardIDs', standards);
        }
    },

    onLinkBlur: function(field) {
        var ct = field.up('fieldcontainer'),
            ctOwner = ct.up('fieldset'),
            link = {},
            clone,
            rowediting,
            record;

        // get link from this field container
        ct.items.each(function(field) {
            link[field.getName()] = field.getValue();
        });

        // create new link fieldcontainer if this container is last and has a valid link
        if (ct.lastInGroup && link.url && link.title) {
            ct.lastInGroup = false;
            clone = ctOwner.add(ct.cloneConfig({isClone: true}));
        }

        //console.log(ct.lastInGroup);
        //console.log(link.url);
        //console.log(link.title);

        // update record if this link is valid
        if (link.url && link.title) {
            rowediting = this.getPanel().getPlugin('rowediting');
            record = rowediting.editor.getRecord();
            record.set('Links', ctOwner.getValues());
        }
        // remove container and update record if has been blanked
        else if (!ct.lastInGroup && !link.url && !link.title) {
            rowediting = this.getPanel().getPlugin('rowediting');
            record = rowediting.editor.getRecord();
            record.set('Links', ctOwner.getValues());
            ctOwner.remove(ct);
        }
    },

    onPanelBeforeEdit: function() {
        this.getEditor().setReadOnly(false);
    },

    onPanelEdit: function(editor, context) {
        this.getEditor().setReadOnly(true);
        context.record.save();
    },

    onPanelValidateEdit: function() {
        this.getEditor().updateRecord();
    },

    onPanelCancelEdit: function() {
        this.getEditor().setReadOnly(true);
    }

});
