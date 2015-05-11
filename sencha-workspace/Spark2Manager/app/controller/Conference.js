Ext.define('Spark2Manager.controller.Conference', {
    requires: [
        'Spark2Manager.store.GuidingQuestions',
        'Spark2Manager.view.StandardPicker'
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
        this.getGuidingQuestionsStore().load();
    },

    onAddClick: function() {
        var me = this,
            rowEditing = me.getPanel().plugins[0], // I used to be able to do getPlugin('cellediting') but not w/ row
            newLink = me.getGuidingQuestionsStore().insert(0, {});

        rowEditing.cancelEdit();
        rowEditing.startEdit(newLink[0], 0);
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
            selection = panel.getSelection(),
            standardsPicker;

        selection = Array.isArray(selection) ? selection[0] : null;

        if (selection) {
            standardsPicker = new Ext.create('Spark2Manager.view.StandardPicker', {
                record: selection
            });

            standardsPicker.show();
        }
    }
});
