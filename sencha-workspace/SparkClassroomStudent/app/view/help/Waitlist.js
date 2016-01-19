/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.help.Waitlist', {
    extend: 'Ext.Container',
    xtype: 'spark-waitlist',
    requires: [
        'Jarvus.util.format.FuzzyTime'
    ],


    config: {
        cls: 'spark-waitlist',
        items: [
            {
                xtype: 'container',
                cls: 'spark-waitlist-title',
                html: 'Waitlist',
            },
            {
                xtype: 'list',
                store: 'HelpRequests',
                itemTpl: [
                    '<span class="spark-waitlist-name">{student_name}</span> ',
                    '<span class="spark-waitlist-time">{open_time:fuzzyTime(true)}</span> ',
                    '<span class="spark-waitlist-x">{short_request_type}</span> ',
                    '<tpl if="can_delete">',
                        '<i class="fa fa-times-circle item-delete-btn"></i>',
                    '</tpl>'
                ]
            }
        ]
    }
});