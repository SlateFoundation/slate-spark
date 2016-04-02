/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.learns.LearnsRequiredField', {
    extend: 'Ext.field.Number',
    xtype: 'spark-teacher-assign-learns-learnsrequiredfield',
    requires: [
        'SparkClassroom.plugin.FieldTrigger',
        'SparkClassroom.panel.StudentLearnsRequired'
    ],
    mixins: [
        'Ext.mixin.Queryable'
    ],


    config: {
        popupVisible: false,

        // internal state
        popup: null,
        studentsStore: 'Students',
        activeStudentsStore: 'gps.ActiveStudents',

        labelAlign: 'left',
        labelWidth: 350,
        width: 500,
        label: 'Number of Learns required for this sparkpoint',
        minValue: 1,
        maxValue: 15,
        stepValue: 1,
        placeHolder: 5,
        plugins: 'fieldtrigger',
        listeners: {
            triggertap: 'onTriggerTap'
        }
    },


    // method overrides
    /**
     * Implements required Ext.mixin.Queryable method so that the popup
     * container can be discovered as a child component
     */
    getRefItems: function() {
        var popup = this.getPopup();
        return popup ? [popup] : [];
    },


    // config handlers
    applyStudentsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateStudentsStore: function(store, oldStore) {
        var me = this;

        if (oldStore) {
            oldStore.un('load', 'onStudentsStoreLoad', me);
        }

        if (store) {
            me.studentIdStrings = store.getStudentIdStrings();
            store.on('load', 'onStudentsStoreLoad', me);
        }
    },

    applyActiveStudentsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updatePopupVisible: function(visible) {
        var me = this,
            sectionLearnsRequired = me.getValue(),
            popup = this.getPopup(),
            containingScrollable = me.containingScrollable,
            activeStudentsStore = me.getActiveStudentsStore(),

            studentsStore = me.getStudentsStore(),
            studentsCount = studentsStore.getCount(),
            i = 0, student, studentId,

            popupStore, fieldEl, x, y, scrollable;

        if (!visible) {
            if (popup) {
                popup.hide();
            }

            return;
        }

        // find container that provides scrolling
        if (!containingScrollable) {
            containingScrollable = me.containingScrollable = me.up(':scrollable') || Ext.Viewport;
        }

        // create and render popup the first time it's needed
        if (!popup) {
            me.setPopup(popup = Ext.create('SparkClassroom.panel.StudentLearnsRequired', {
                hidden: true
            }));

            // use this field as the parent of the popup for the component hierarchy
            popup.setParent(me);

            // render popup to the containing scroll surface
            popup.setRenderTo(containingScrollable.innerElement);
        }

        // initially display popup invisibly so it can be measured
        popup.setVisibility(false);
        popup.show();

        // populate grid data
        popupStore = popup.getGrid().getStore();
        popupStore.beginUpdate();

        popupStore.removeAll(true);

        for (; i < studentsCount; i++) {
            student = studentsStore.getAt(i);
            studentId = student.getId();

            popupStore.add({
                id: studentId,
                student: student,
                studentSparkpoint: activeStudentsStore.findRecord('student_id', studentId),
                learnsRequired: {
                    section: sectionLearnsRequired,
                    student: null
                }
            });
        }

        popupStore.endUpdate();

        // start positioning at bottom-left corner of assign cell
        fieldEl = this.element;
        x = fieldEl.getLeft();
        y = fieldEl.getBottom();

        // shift to accomodate scrollable parent
        scrollable = containingScrollable.getScrollable();
        if (scrollable) {
            y += scrollable.getPosition().y;
            y -= scrollable.getElement().getTop();
        }

        // position and show popup
        popup.setLeft(x);
        popup.setTop(y);
        popup.setVisibility(true);
    },


    // event handlers
    onTriggerTap: function() {
        this.setPopupVisible(!this.getPopupVisible());
    },

    onStudentsStoreLoad: function(store) {
        this.studentIdStrings = store.getStudentIdStrings();
    }
});