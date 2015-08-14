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
        'SparkClassroom.work.TabBar',
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
                            xtype: 'selectfield',
                            cls: 'spark-navbar-standard-selector',
                            label: 'Standard',
                            labelCls: 'visually-hidden',
                            options: [
                                {
                                    text: 'Select Standard'
                                }
                            ]
                        },
                        {
                            xtype: 'label',
                            cls: 'spark-navbar-timer',
                            html: '5 days'
                        },
                        {
                            xtype: 'component',
                            flex: 1
                        },
                        {
                            text: 'Classwork',
                            cls: 'is-selected'
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
                    itemId: 'page-wrap',
                    cls: 'page-wrap',
                    items: [
                        {
                            xtype: 'spark-work-tabbar'
                        }
                    ]
                },
            ]
        }
    }
});
