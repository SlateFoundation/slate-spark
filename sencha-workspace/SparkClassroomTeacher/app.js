/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */
Ext.application({
    name: 'SparkClassroomTeacher',

    extend: 'SparkClassroomTeacher.Application',
    requires: [
        // TODO: move this to a hotfix override
        'Ext.form.Panel', // TODO: remove when framework bug fixed: https://www.sencha.com/forum/showthread.php?303365
    ],

    //-------------------------------------------------------------------------
    // Most customizations should be made to SparkClassroomTeacher.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------

    // TODO: move all this to the Application class
    views: [
        'TitleBar@SparkClassroom.view',
        'TeacherTabBar'
    ],
    controllers: [
        //'Viewport', potentially deprecated
        'GPS',
        'sparkTabBar',
        'work.Work',
        'competencies.Competencies',
        'assign.Assign'
    ],

    config: {
        viewport: {
            layout: 'auto',
            scrollable: 'vertical',
            // TODO: move all items to viewport launch  function
            items: [
                {
                    xtype: 'spark-titlebar'
                },
                {
                    xtype: 'spark-teacher-tabbar',
                    itemId: 'teacherTabs', // TODO: remove this, the xtype is unique enough
                    padding: '48 24', // TODO: move to class
                    items: [
                        {
                            xtype: 'spark-teacher-tabbar' // TODO: why does this thing contain itself?
                        }
                    ]
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
