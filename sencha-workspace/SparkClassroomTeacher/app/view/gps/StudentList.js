/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.StudentList', {
    extend: 'Ext.dataview.List',
    xtype: 'spark-gps-studentList',
    cls: 'spark-gps-studentlist',

    config: {
        title: null,

        itemCls: 'studentlist-item',
        itemTpl: [
            '<header class="studentlist-item-header">',
                '<a class="studentlist-name" href="#">{Student.FirstName} {Student.LastName}</a> ',
                '<tpl if="Grade"><span class="studentlist-grade">{Grade}</span></tpl> ',
                '<span class="studentlist-timer">20m</span>',
            '</header>',
            '<ul class="studentlist-standards">',
                '<tpl for="Standards">',
                    '<li class="studentlist-standard">{.}</li>',
                '</tpl>',
            '</ul>'
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