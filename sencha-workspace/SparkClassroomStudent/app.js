/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */
Ext.application({
    name: 'SparkClassroomStudent',

    extend: 'SparkClassroomStudent.Application',
    requires: [
        'SparkClassroom.view.TitleBar',
        'SparkClassroom.view.NavBar',
        'Ext.form.Panel' // TODO: remove when framework bug fixed: https://www.sencha.com/forum/showthread.php?303365
    ],

    //-------------------------------------------------------------------------
    // Most customizations should be made to SparkClassroomStudent.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------

    views: [
        'work.apply.Main',
        'work.learn.Main',
        'work.conference.Main',
        'work.assess.Main'   
    ],

    controllers: [
        'Viewport'
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
                    xtype: 'spark-navbar',
                    items: [
                        {
                            xtype: 'selectfield'
                        },
                        {
                            xtype: 'component',
                            html: '5 days'
                        },
                        {
                            xtype: 'component',
                            flex: 1
                        },
                        {
                            text: 'Classword'
                        },
                        {
                            text: 'Standards'
                        },
                        {
                            text: 'GPS'
                        },
                        {
                            text: 'Activity'
                        },
                        {
                            text: 'Help'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    cls: 'page-wrap',
                    items: [
                        {
                            xtype: 'spark-student-work-learn'                        
                        }
                    ]
                },
                {
                    // xtype: 'spark-student-work-conference'
                },
                {
                    // xtype: 'spark-student-work-apply'
                },
                {
                    // xtype: 'spark-student-work-assess'
                }
            ]
        }
    }
});
