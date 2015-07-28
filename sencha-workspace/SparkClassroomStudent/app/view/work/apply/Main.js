/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.work.apply.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-student-work-apply',

    config: {
        layout: 'vbox',
        items: [
            {
                xtype: 'toolbar',
                items: [
                    {
                        xtype: 'component',
                        html: 'Suggested Applies',
                        width: '80%'
                    },
                    {
                        xtype: 'component',
                        html: 'Standards Incorporated',
                        width: '20%'
                    }
                ]
            },
            {
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'component',
                        width: '80%',
                        html: [
                            '<input type="checkbox"><h5>Write it</h5>',
                            '<span>Write A paragraph that has both active and passive voice sentences. Be sure to underline your sentences that display the learning target</span>'
                        ].join('')
                    },
                    {
                        xtype: 'component',
                        width: '20%',
                        html: [
                            '<span>8.L.0.B</span> ',
                            '<span>8.L.7.B</span> ',
                            '<span>8.L.5.B</span> '
                        ].join('')
                    }
                ]
            },
            {
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'component',
                        width: '80%',
                        html: [
                            '<input type="checkbox"><h5>Create it</h5>',
                            '<span>Create a powerpoint or prezi to teach this learning target to your peers. Don\'t limit yourself. Be creative and be sure to include practice activities. You may even decide to use Storybird or Storeboard</span>'
                        ].join('')
                    },
                    {
                        xtype: 'component',
                        width: '20%',
                        html: [
                            '<span>8.L.7</span> ',
                            '<span>8.L.3</span> '
                        ].join('')
                    }
                ]
            },
            {
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'component',
                        width: '80%',
                        html: [
                            '<input type="checkbox"><h5>Wild Card</h5>',
                            '<span>Record a video on teaching students how to use active and passive voice. In your video, be sure to identify what is active and passive voice.</span>'
                        ].join('')
                    },
                    {
                        xtype: 'component',
                        width: '20%',
                        html: [
                            'None'
                        ].join('')
                    }
                ]
            },
            {
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'component',
                        flex: 1,
                        html: [
                            '<input type="checkbox"><h5>Suggest my own:</h5>',
                            '<textarea></textarea>'
                        ].join('')
                    }
                ]
            }
        ]
    }
});