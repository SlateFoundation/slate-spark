Ext.define('Spark2Manager.controller.Conference', {
    requires: [
        'Spark2Manager.store.GuidingQuestions'
    ],

    extend: 'Ext.app.Controller',

    config: {
        refs: [{
            ref: 'panel',
            selector: 's2m-conference-panel'
        }],

        control: {
            's2m-conference-panel': {
                activate: 'onPanelActivate',
                edit: 'onEdit'
            },
            's2m-conference-panel button[action=create-guiding-question]': {
                click: 'onCreateGuidingQuestionClick'
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

    onEdit: function(editor, e) {
        switch(e.column.dataIndex) {
            default:
                console.log(arguments);
        }
    },

    onCreateGuidingQuestionClick: function() {
        var newLink = this.getGuidingQuestionsStore().insert(0, {}),
            p = this.getPanel(),
            plugin = p.getPlugin('cellediting');

        plugin.startEdit(newLink[0], 0);
    }
});
