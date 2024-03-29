/**
 * The Conference controller manages the Conference Questions section of the application where
 * staff can add, edit and delete questions, and align questions to standards
 *
 * ## Responsibilities
 * - Add conference questions
 * - Delete conference questions
 * - Align conference questions to standards
 * - Show align button when standards column is visible
 */
Ext.define('SparkRepositoryManager.controller.Conference', {
    extend: 'Ext.app.Controller',
    requires: [
        'SparkRepositoryManager.store.GuidingQuestions',
        'SparkRepositoryManager.view.StandardPicker',
        'Ext.window.MessageBox'
    ],


    // dependencies
    stores: [
        'GuidingQuestions'
    ],


    // component references
    refs: [{
        ref: 'panel',
        selector: 's2m-conference-panel'
    }, {
        ref: 'alignButton',
        selector: 's2m-conference-panel button[action=align]'
    }, {
        ref: 'alignButtonSeparator',
        selector: 's2m-conference-panel tbseparator#alignButtonSeparator'
    }],


    // entry points
    control: {
        's2m-conference-panel': {
            activate: 'onPanelActivate',
            columnhide: 'onPanelColumnHide',
            columnshow: 'onPanelColumnShow'
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
    },


    // event handlers
    onPanelActivate: function() {
        var guidingQuestionsStore = this.getGuidingQuestionsStore();

        if (!guidingQuestionsStore.isLoaded() || !guidingQuestionsStore.isLoading()) {
            guidingQuestionsStore.load();
        }
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
            descriptiveText = (question ? '"' + question + '"' : '') || 'this guiding question?';

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

    onPanelColumnHide: function(grid, column) {
        var me = this;

        if (column.getXType() === 'srm-standardslistcolumn') {
            me.getAlignButton().hide();
            me.getAlignButtonSeparator().hide();
        }
    },

    onPanelColumnShow: function(grid, column) {
        var me = this;

        if (column.getXType() === 'srm-standardslistcolumn') {
            me.getAlignButton().show();
            me.getAlignButtonSeparator().show();
        }
    }
});
