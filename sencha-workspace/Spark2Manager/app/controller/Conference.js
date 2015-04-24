Ext.define('Spark2Manager.controller.Conference', {
    requires: [
        'Spark2Manager.store.GuidingQuestion'
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
        'GuidingQuestion'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },

    onPanelActivate: function() {
        this.getGuidingQuestionStore().load();
    },

    onEdit: function(editor, e) {
        switch(e.column.dataIndex) {
            default:
                console.log(arguments);
        }
    },

    onCreateGuidingQuestionClick: function() {
        var newLink = this.getGuidingQuestionStore().insert(0, {}),
            p = this.getPanel(),
            plugin = p.getPlugin('cellediting');

        plugin.startEdit(newLink[0], 0);
    }
});
