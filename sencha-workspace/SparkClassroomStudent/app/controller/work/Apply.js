/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.work.Apply', {
    extend: 'Ext.app.Controller',


    config: {
        activeSparkpoint: null
    },

    stores: [
        'work.Applies@SparkClassroom.store'
    ],

    refs: {
        applyCt: 'spark-student-work-apply',
        appliesGrid: 'spark-student-work-apply grid#appliesGrid',
        chooseSelectedApplyBtn: 'spark-student-work-apply button#chooseSelectedApplyBtn',
        selectedApplyCt: 'spark-student-work-apply #selectedApplyCt'
    },

    control: {
        applyCt: {
            activate: 'onApplyCtActivate'
        },
        appliesGrid: {
            select: 'onAppliesGridSelect'
        },
        chooseSelectedApplyBtn: {
            tap: 'onChooseSelectedApplyTap'
        }
    },

    listen: {
        controller: {
            '#': {
                sparkpointselect: 'onSparkpointSelect'
            }
        }
    },


    // config handlers
    updateActiveSparkpoint: function(sparkpoint) {
        var store = this.getWorkAppliesStore();

        // TODO: track dirty state of extraparams?
        store.getProxy().setExtraParam('sparkpoint', sparkpoint);

        // TODO: reload store if sparkpoints param dirty
        if (store.isLoaded()) {
            store.load();
        }
    },


    // event handlers
    onSparkpointSelect: function(sparkpoint) {
        this.setActiveSparkpoint(sparkpoint);
    },


    // TODO: handle loading data into apply section
    onApplyCtActivate: function() {
        var store = this.getWorkAppliesStore();

        // TODO: reload store if sparkpoints param dirty
        if (!store.isLoaded()) {
            store.load();
        }
    },

    onAppliesGridSelect: function(appliesGrid) {
        this.getChooseSelectedApplyBtn().enable();
    },

    onChooseSelectedApplyTap: function() {
        var selectedApply = this.getAppliesGrid().getSelection();

        this.getSelectedApplyCt().show();
    }
});
