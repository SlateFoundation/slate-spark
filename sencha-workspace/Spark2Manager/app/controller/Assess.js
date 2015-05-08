Ext.define('Spark2Manager.controller.Assess', {
        requires: [
            'Spark2Manager.store.StandardCodes',
            'Spark2Manager.store.Assessments',
            'Spark2Manager.store.AssessmentTypes',
            'Spark2Manager.store.Links'
        ],

        extend: 'Ext.app.Controller',

        config: {
            refs: [{
                ref: 'panel',
                selector: 's2m-assess-panel'
            }],

            control: {
                's2m-assess-panel': {
                    activate: 'onPanelActivate',
                    edit: 'onEdit'
                },
                's2m-assess-panel button[action=create-assessment]': {
                    click: 'onCreateAssessmentClick'
                }
            }
        },

        stores: [
        'StandardCodes',
        'Assessments',
        'AssessmentTypes',
        'Links'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },

    onPanelActivate: function() {
        this.getAssessmentsStore().load();
        this.getAssessmentTypesStore().load();
        this.getLinksStore().load();
    },

    onEdit: function(editor, e) {
        switch(e.column.dataIndex) {
            default:
                console.log(arguments);
        }
    },

    onCreateAssessmentClick: function() {
        //debugger;

        var newAssessment = this.getAssessmentsStore().insert(0, {}),
            p = this.getPanel(),
            plugin = p.getPlugin('cellediting');

        plugin.startEdit(newAssessment[0], 0);
    }
});
