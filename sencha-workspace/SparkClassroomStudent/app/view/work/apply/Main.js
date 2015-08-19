/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.work.apply.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-student-work-apply',
    requires: [
        'SparkClassroom.widget.SimpleHeading'
    ],

    config: {
        items: [
            {
                xtype: 'spark-simpleheading',
                level: 1,
                cls: 'spark-view-headline',
                html: 'Time to Apply your knowledge!'
            },
            {
                xtype: 'grid',
                titleBar: false,
                store: {
                    fields: [ 'title', 'description', 'standards', 'checked' ],
                    data: [
                        {
                            title: 'Write It',
                            description: 'Write a paragraph that has both active and passive voice sentences. Be sure to underline your sentences that display the learning target.',
                            standards: [ '8.L.01b', '8.L.7', '8.L.5' ]
                        },
                        {
                            title: 'Create It',
                            description: 'Create a Powerpoint or Prezi to teach this learning target to your peers. Don’t limit yourself. Be creative and be sure to include practice activities. You may even decide to use Storybird or Storyboard.',
                            standards: [ '8.L.7', '8.L.3' ],
                            checked: true
                        },
                        {
                            title: 'Wild Card',
                            description: 'Record a video teaching students how to use active and passive voice. In your video, be sure to identify what is active and passive voice.'
                        }
                    ],
                },
                columns: [
                    {
                        xtype: 'booleancolumn',
                        dataIndex: 'checked',
                        width: 100
                    },
                    {
                        xtype: 'templatecolumn',
                        width: 700,
                        cell: { encodeHtml: false },
                        tpl: [
                            '<h3 class="grid-item-title">{title}</h3>',
                            '<tpl if="description"><div class="grid-item-detail">{description}</div></tpl>'
                        ]
                    },
                    {
                        xtype: 'templatecolumn',
                        text: 'Standards Incorporated',
                        dataIndex: 'standards',
                        cell: { encodeHtml: false },
                        tpl: '<tpl if="standards"><ul class="grid-token-list"><tpl for="standards"><li class="grid-token-item">{.}</li></tpl></ul></tpl>',
                        width: '250'
                    }
                ],
                height: 300
            },
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'end'
                },
                items: [
                    {
                        xtype: 'button',
                        ui: 'action',
                        text: 'Choose Selected Apply' // TODO polish this copy? include apply name?
                    }
                ]
            }
        ]
    }
});