/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work',

    config: {
        layout: 'vbox',
        title: 'Student Work',
        items: [
            // TODO: add a config option to the Teacher version of this class that, if set to an array of students, causes
            // this toolbar to be inserted 
            {
                xtype: 'tabbar',
                tabType: 'mainTab',
                items: [
                    {
                        title: 'Learn &amp; Practice',
                        section: 'learn'
                    },
                    {
                        title: 'Conference',
                        section: 'conference'
                    },
                    {
                        title: 'Apply',
                        section: 'apply'
                    },
                    {
                        title: 'Assess',
                        section: 'assess'
                    }
                ]
            }
        ]
    }
});