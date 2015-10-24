/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.learn.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-work-learn',
    requires: [
        'SparkClassroom.work.learn.ProgressBanner',
        'SparkClassroom.work.learn.Grid',
        'Jarvus.layout.Accordion'
    ],

    config: {
        itemId: 'learn',

        items: [{
            layout: 'accordion',
            items: [
                {
                    expanded: true,
                    itemId: 'sparkpointCt',

                    xtype: 'container',
                    title: '[Select a Sparkpoint]',
                    items: [
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                pack: 'center'
                            },
                            items: [
                                {
                                    xtype: 'spark-work-learn-progressbanner',
                                    hidden: true
                                }
                            ]
                        },
                        {
                            xtype: 'spark-work-learn-grid'
                        }
                    ]
                }
            ]
        }]
    }
});