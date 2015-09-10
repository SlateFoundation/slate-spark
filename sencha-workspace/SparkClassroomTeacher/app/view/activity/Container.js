/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.activity.Container', {
    extend: 'Ext.Panel',
    xtype: 'spark-activity',

    config: {
    	/*
			these are style work around for a ExtJS 6 modern bug:
			https://goo.gl/t2xakq
    	*/
    	margin: '-17 0', // needs handled with sass
    	left: 0,
    	
    	width: 300,
        items: [
        	{
        		xtype: 'spark-activity-list'
        	}
        ]
    }
});