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
                title: 'Wait List',
                store: 'HelpRequests',
                itemTpl: [
                    '<span class="spark-waitlist-name">{StudentFullName}</span> ',
                    '<span class="spark-waitlist-time">{Created:fuzzyTime(true)}</span> ',
                    '<span class="spark-waitlist-x">{ShortType}</span> ',
                    '<i class="fa fa-times-circle item-delete-btn"></i>'
                ]
            }
        ]
    }
});