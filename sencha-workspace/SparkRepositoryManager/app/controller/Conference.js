Ext.define('SparkRepositoryManager.controller.Conference', {
    requires: [
        'SparkRepositoryManager.store.GuidingQuestions',
        'SparkRepositoryManager.view.StandardPicker',
        'Ext.window.MessageBox'
    ],

    extend: 'Ext.app.Controller',

    config: {
        refs: [{
            ref: 'panel',
            selector: 's2m-conference-panel'
        }],

        control: {
            's2m-conference-panel': {
                activate: 'onPanelActivate'
            },
            's2m-conference-panel button[action=add]': {
                click: 'onAddClick'
            },
            's2m-conference-panel button[action=delete]': {
                click: 'onDeleteClick'
            },
            's2m-conference-panel button[action=align]': {
                click: 'onAlignClick'
            }
        }
    },

    stores: [
        'GuidingQuestions'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },

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
            rowEditing = me.getPanel().getPlugin('rowediting'),
            rec = rowEditing.editing ? rowEditing.getEditor().getRecord() : null,
            newRecord;

        if (rec !== null && (rowEditing.getEditor().isDirty() || rec.phantom)) {
            Ext.Msg.alert('Unsaved changes', 'You must save or cancel your changes before creating a new guiding question.');
        } else {
            newRecord = me.getGuidingQuestionsStore().insert(0, {});
            rowEditing.startEdit(newRecord[0], 0);
        }
    },

    onDeleteClick: function() {
        var me = this,
            panel = me.getPanel(),
            rowEditing = panel.plugins[0],
            selectionModel = panel.getSelectionModel(),
            selection = selectionModel.getSelection()[0],
            guidingQuestionStore = me.getGuidingQuestionsStore(),
            question = selection.get('Question'),
            descriptiveText =  (question ? '"' + question + '"' : '') || 'this guiding question?';

        Ext.Msg.confirm('Are you sure?', 'Are you sure that you want to delete ' + descriptiveText + '?', function(response) {
            if (response === 'yes') {
                rowEditing.cancelEdit();

                guidingQuestionStore.remove(selection);

                if (guidingQuestionStore.getCount() > 0) {
                    selectionModel.select(0);
                }
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
            tagField = editor.getRefItems()[0];
            standards = tagField.getValue().map(function(standard) {
                return standard.standardCode ? standard : { standardCode: standard };
            });
        } else {
            standards = record.get('Standards');
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
            tagField,
            record;

        if (isEditing) {
            // HACK: @themightychris what's a better way to get a reference to the tagfield in the roweditor?
            tagField = editor.getRefItems()[0];
            tagField.setValue(standards.map(function(standard) {
                return standard.standardCode;
            }));
        } else {
            record = panel.getSelection()[0];
            record.set('Standards', standards);
        }
    }
});
