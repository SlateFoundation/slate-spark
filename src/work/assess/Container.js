/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.assess.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-work-assess',
    requires: [
        'SparkClassroom.widget.Panel',
        'SparkClassroom.widget.SimpleHeading',
        'SparkClassroom.work.assess.AssessmentsGrid',
        'SparkClassroom.work.assess.LearnsGrid'
    ],

    config: {
        itemId: 'assess',

        items: [
            // {
            //     xtype: 'spark-simpleheading',
            //     cls: 'spark-view-headline',
            //     level: 1,
            //     html: 'Select an Assessment'
            // },
            // {
            //     xtype: 'spark-work-assess-assessmentsgrid'
            // },
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                items: [{
                    itemId: 'illuminateLauncher',

                    xtype: 'component',
                    margin: '0 0 32 0',
                    html: '<a href="https://matchbook.illuminatehc.com/login" target="_blank" class="button primary">Go to Illuminate</a>',
                    listeners: {
                        element: 'element',
                        delegate: 'a',
                        click: function(ev, t) {
                            this.fireEvent('launchclick', this, ev, t);
                        }
                    }
                }]
            },
            {
                xtype: 'spark-panel',
                title: 'Reflection',
                items: [
                    {
                        xtype: 'textareafield',
                        label: 'How does this standard apply to everyday life?',
                        placeHolder: 'Write a paragraph about what you’ve learned with this standard.'
                    }
                ]
            },
            {
                xtype: 'spark-work-assess-learnsgrid'
            }
        ]
    }
});