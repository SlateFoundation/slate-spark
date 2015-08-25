/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.Main', {
    extend: 'Ext.Container',
    requires: [
        'SparkClassroom.work.TabBar'
    ],
    xtype: 'spark-work',

    config: {
        layout: 'vbox',
        title: 'Student Work',
        items: [
            // TODO: add a config option to the Teacher version of this class that, if set to an array of students, causes
            // this toolbar to be inserted 
            {
                xtype: 'spark-work-tabbar'
            }
        ]
    }
});