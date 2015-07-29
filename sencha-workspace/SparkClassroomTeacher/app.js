/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */
Ext.application({
    name: 'SparkClassroomTeacher',

    extend: 'SparkClassroomTeacher.Application',
    requires: [
        'Ext.form.Panel' // TODO: remove when framework bug fixed: https://www.sencha.com/forum/showthread.php?303365
    ],

    //-------------------------------------------------------------------------
    // Most customizations should be made to SparkClassroomTeacher.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------

    views: [
        'TitleBar',
        'TabBar'
    ],
    controllers: [
        'Viewport',
        'Work',
        'GPS',
        'assign.Points'
    ],

    config: {
        viewport: {
            layout: 'auto',
            scrollable: 'vertical',
            items: [
                {
                    xtype: 'spark-titlebar'
                },
                {
                    xtype: 'spark-tabbar'
                }
            ]
        }
    },
    
    launch: function() {
        Ext.Viewport.insert(1,[
            {
                xtype: 'spark-gps'
            }
        ]);
    }
    
});
