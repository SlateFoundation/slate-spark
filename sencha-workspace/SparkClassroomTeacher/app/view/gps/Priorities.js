/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.Priorities', {
    extend: 'Ext.dataview.List',
    xtype: 'spark-priorities',
    mixins: [
        'SparkClassroom.mixin.DockedTitle'
    ],
    requires: [
        'Jarvus.util.format.FuzzyTime'
    ],


    config: {
        cls: 'spark-gps-priorities',

        store: 'gps.Priorities',
        itemTpl: [
            '<header class="item-header">',
                '<tpl for="student.getData()">',
                    '<a class="item-origin" target="_blank" onclick="return false;">asd</a> ',
                '</tpl>',
                '<span class="item-timestamp">asd</span> ',
                '<i class="fa fa-times item-remove-btn"></i>',
            '</header>',
            '<div class="item-description">',
                'asd',
                '<span class="waitlist-type">asd</span>',
            '</div>'
        ]
    }
});