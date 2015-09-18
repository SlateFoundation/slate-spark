/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.activity.Container', {
    extend: 'Ext.Panel',
    xtype: 'spark-activity',

    config: {
    	/*
			these are style work around for a ExtJS 6 modern bug:
			https://goo.gl/t2xakq
    	*/
    	// TODO figure out why showBy() is so busted. linked bug doesn't seem to cover everything
    	margin: '-17 0', // needs handled with sass
    	left: 0,
    	
    	width: 288,
        items: [
        	{
        		xtype: 'spark-activity-list'
        	}
        ]
    }
});