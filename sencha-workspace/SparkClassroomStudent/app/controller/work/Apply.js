/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.work.Apply', {
    extend: 'Ext.app.Controller',


    config: {
        activeSparkpoint: null,
        activeApply: null
    },

    stores: [
        'work.Applies@SparkClassroom.store'
    ],

    refs: {
        applyCt: 'spark-student-work-apply',
        appliesGrid: 'spark-student-work-apply grid#appliesGrid',
        chooseSelectedApplyBtn: 'spark-student-work-apply button#chooseSelectedApplyBtn',
        selectedApplyCt: 'spark-student-work-apply #selectedApplyCt',
        headerCmp: 'spark-student-work-apply #headerCmp',
        todosGrid: 'spark-student-work-apply grid#todosGrid',
        linksCmp: 'spark-student-work-apply #linksCmp'
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

    updateActiveApply: function(apply) {
        var me = this;

        me.getTodosGrid().getStore().loadData(apply.get('todos').map(function(todo) {
            return {
                todo: todo,
                date_due: new Date()
            };
        }));

        me.getLinksCmp().setData(apply.get('links').map(function(url) {
            return {
                title: url.replace(/^https?:\/\//, ''),
                url: url
            };
        }));

        me.getHeaderCmp().setData(apply.getData());

        me.getSelectedApplyCt().show();
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
        this.setActiveApply(this.getAppliesGrid().getSelection());
    }
});
