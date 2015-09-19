/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.help.Waitlist', {
    extend: 'Ext.Container',
    xtype: 'spark-waitlist',

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
                // store: 'Students',
                store: {
                    fields: [ 'Name', 'Time', 'X' ],
                    data: [
                        { Name: 'Ryon C.',      Time: '5m',     X: 'G?' },
                        { Name: 'Alexandra W.', Time: '15m',    X: 'B' },
                        { Name: 'Michael E.',   Time: '10m',    X: 'A?' },
                        { Name: 'Daniel H.',    Time: '16m',    X: 'T?' },
                        { Name: 'Willow S.',    Time: '25m',    X: 'IT' },
                    ]
                },
                itemTpl: [
                    '<span class="spark-waitlist-name">{Name}</span> ',
                    '<span class="spark-waitlist-time">{Time}</span> ',
                    '<span class="spark-waitlist-x">{X}</span> ',
                    '<i class="fa fa-times-circle item-delete-btn"></i>'
                ]
            }
    	]
    }
});