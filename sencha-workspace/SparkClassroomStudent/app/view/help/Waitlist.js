/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.help.Waitlist', {
    extend: 'Ext.Panel',
    xtype: 'spark-waitlist',

    config: {
    	flex: 1,
    	items: [
    		{
    			xtype: 'container',
    			html: 'Waitlist',
    			docked: 'top'
    		},
    		{
                xtype: 'list',
                title: 'Wait List',
                store: 'Students',
                itemTpl: ''    
            }
    	]
    }
});