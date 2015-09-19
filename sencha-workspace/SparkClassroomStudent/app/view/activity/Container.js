/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.activity.Container', {
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
        		xtype: 'spark-activity-list',
        		itemTpl: [
                    '<strong class="activity-verb">Completed L&P</strong> ',
                    '<span class="activity-preposition">of</span> ',
                    '<span class="activity-object activity-standard">CC.SS.Math.Content.1.OA.A.1</span>'
        		]
        	}
        ]
    }
});