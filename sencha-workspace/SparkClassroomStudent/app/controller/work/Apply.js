/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.work.Apply', {
    extend: 'Ext.app.Controller',

    config: {
        activeSparkpoint: null,
        studentSparkpoint: null,
        activeApply: null
    },

    stores: [
        'work.Applies@SparkClassroom.store'
    ],

    refs: {
        applyCt: 'spark-student-work-apply',
        applyPickerCt: 'spark-student-work-apply #applyPickerCt',
        appliesGrid: 'spark-student-work-apply grid#appliesGrid',
        reflectionField: 'spark-student-work-apply #reflectionField',
        chooseSelectedApplyBtn: 'spark-student-work-apply button#chooseSelectedApplyBtn',
        selectedApplyCt: 'spark-student-work-apply #selectedApplyCt',
        chooseAgainBtn: 'spark-student-work-apply button#chooseAgainBtn',
        headerCmp: 'spark-student-work-apply #headerCmp',
        todosGrid: 'spark-student-work-apply grid#todosGrid',
        linksCmp: 'spark-student-work-apply #linksCmp',
        attachFileButton: 'spark-panel button#attachFileBtn'
    },

    control: {
        applyCt: {
            activate: 'onApplyCtActivate'
        },
        appliesGrid: {
            select: 'onAppliesGridSelect'
        },
        reflectionField: {
            change: 'onReflectionFieldChange'
        },
        chooseSelectedApplyBtn: {
            tap: 'onChooseSelectedApplyTap'
        },
        chooseAgainBtn: {
            tap: 'onChooseAgainTap'
        },
        attachFileButton: {
            tap: 'onAttachFileButtonTap'
        }
    },

    listen: {
        controller: {
            '#': {
                sparkpointselect: 'onSparkpointSelect',
                studentsparkpointload: 'onStudentSparkpointLoad'
            }
        },
        store: {
            '#work.Applies': {
                load: 'onAppliesStoreLoad'
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
        var me = this,
            applyPickerCt = me.getApplyPickerCt(),
            selectedApplyCt = me.getSelectedApplyCt();

        if (apply) {
            apply.set('sparkpoint', me.getStudentSparkpoint().get('sparkpoint'), { dirty: false });

            me.getTodosGrid().getStore().loadData(apply.get('todos').map(function(todo) {
                return {
                    todo: todo,
                    date_due: new Date()
                };
            }));

            me.getLinksCmp().setData(apply.get('links').map(function(link) {
                return {
                    title: link.title || link.url.replace(/^https?:\/\//, ''),
                    url: link.url
                };
            }));

            me.getHeaderCmp().setData(apply.getData());

            me.getReflectionField().setValue(apply.get('reflection'));
        }

        applyPickerCt.setHidden(apply);
        selectedApplyCt.setHidden(!apply);
    },


    // event handlers
    onSparkpointSelect: function(sparkpoint) {
        this.setActiveSparkpoint(sparkpoint);
    },

    onStudentSparkpointLoad: function(studentSparkpoint) {
        this.setStudentSparkpoint(studentSparkpoint);
    },


    // TODO: handle loading data into apply section
    onApplyCtActivate: function() {
        var store = this.getWorkAppliesStore();

        // TODO: reload store if sparkpoints param dirty
        if (!store.isLoaded()) {
            store.load();
        }
    },

    onAppliesStoreLoad: function(appliesStore) {
        this.setActiveApply(appliesStore.query('selected', true).first() || null);
    },

    onAppliesGridSelect: function(appliesGrid) {
        this.getChooseSelectedApplyBtn().enable();
    },

    onReflectionFieldChange: function() {
        this.writeReflection();
    },

    onChooseSelectedApplyTap: function() {
        var me = this,
            apply = me.getAppliesGrid().getSelection();

        me.setActiveApply(apply);
        apply.set('selected', true);
        apply.save();
    },

    onChooseAgainTap: function() {
        this.setActiveApply(null);
    },

    onAttachFileButtonTap: function() {
        //console.log('onAttachFileButtonTap');
    },


    // controller methods
    writeReflection: Ext.Function.createBuffered(function() {
        var apply = this.getActiveApply();

        apply.set('reflection', this.getReflectionField().getValue());

        if (apply.dirty) {
            apply.save();
        }
    }, 2000)
});