/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.activity.ActivityList', {
    extend: 'Ext.List',
    xtype: 'spark-activity-list',

    config: {
        store: '', // This feature is on ice for now, removed Activities store to avoid misuse and confusion.
        grouped: true,
        itemTpl: [
            '<header class="studentlist-item-header">',
                '<a class="studentlist-name" href="#">{FirstName} {LastName}</a> ',
                '<span class="studentlist-timer">{Grade}</span>',
            '</header>',
            '<ul class="studentlist-standards">',
                    '<li class="studentlist-standard">{Activity}</li>',
            '</ul>'
        ]
    }
});