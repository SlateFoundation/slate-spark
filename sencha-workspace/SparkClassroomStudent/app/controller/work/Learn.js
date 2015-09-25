/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.controller.work.Learn', {
    extend: 'Ext.app.Controller',


    // TODO: handle loading data into learn section
    refs: {
        learnCt: 'spark-student-work-learn',
        learnGrid: 'spark-work-learn-grid'
    },

    control: {
        learnCt: {
            activate: 'onLearnCtActivate'
        }
    },

    onLearnCtActivate: function(learnCt) {
        var grid = this.getLearnGrid(),
            store = grid.getStore();

        store.load();
        //TODO: Reenable when grid can start empty
        // if(!store.isLoaded()) {
        //     store.load();
        // }
    }
});