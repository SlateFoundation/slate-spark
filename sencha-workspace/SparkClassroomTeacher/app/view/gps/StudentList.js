/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.StudentList', {
    extend: 'Ext.dataview.List',
    xtype: 'spark-gps-studentList',

    config: {
        title: null,

        itemTpl: [
            '{FirstName} {LastName} <tpl if="Grade">- {Grade}</tpl><br>',
            '<tpl for="Standards">',
                '{.}',
            '</tpl>'
        ]
    },

    applyTitle: function(title, existingTitle) {
        if (Ext.isString(title)) {
            title = {
                title: title
            };
        }

        return Ext.factory(title, 'Ext.Title', existingTitle);
    },

    updateTitle: function(title, oldTitle) {
        if (title) {
            title.setDocked('top');
            this.add(title);
        }

        if (oldTitle) {
            this.remove(oldTitle);
        }
    }
});