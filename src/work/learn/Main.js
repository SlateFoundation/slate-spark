/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.learn.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work-learn',
    requires: [
        'SparkClassroom.work.learn.ProgressBanner',
        'SparkClassroom.work.learn.Grid',
        'Jarvus.layout.Accordion'
    ],

    config: {
        items: [
            {
                // TODO: remove this double-bagging?
                xtype: 'container',
                itemId: 'standardGrid',
                items: [
                    {
                        xtype: 'container',
                        layout: 'accordion',
                        items: [
                            {
                                xtype: 'container',
                                title: 'Standards Blarg',
                                items: [
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            pack: 'center'
                                        },
                                        items: [
                                            {
                                                xtype: 'spark-work-learn-progressbanner'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'spark-work-learn-grid'
                                    }
                                ]
                            },
                            {
                                xtype: 'component',
                                html: 'stuff',
                                title: 'Standard 2'
                            },
                            {
                                xtype: 'component',
                                html: 'stuff',
                                title: 'Standard 1'
                            }
                        ]
                    }
                ]
            }
        ]
    }
});