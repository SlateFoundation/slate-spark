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
        'gps.Main',
        'gps.tabs.StudentWork',
        'gps.tabs.Overview',
        'gps.tabs.Assign',
        'TabBar'
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
                    xtype: 'spark-gps'
                },
                {
                    xtype: 'container',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'tabpanel',
                            items: [
                                {
                                    xtype: 'spark-gps-tabs-studentwork'
                                },
                                {
                                    xtype: 'spark-gps-tabs-overview'
                                },
                                {
                                    xtype: 'spark-gps-tabs-assign'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
});
