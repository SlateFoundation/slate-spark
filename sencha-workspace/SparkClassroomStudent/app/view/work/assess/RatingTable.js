/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.work.assess.RatingTable', {
    extend: 'Ext.Container',
    xtype: 'spark-work-assess-ratingtable',

    config: {
        layout: 'vbox',
        items: [
            {
                xtype: 'toolbar',
                items: [
                    {
                        xtype: 'component',
                        html: 'Learns',
                        width: '55%'
                    },
                    {
                        xtype: 'component',
                        html: 'Your Rating',
                        width: '15%'
                    },
                    {
                        xtype: 'component',
                        html: 'Comments',
                        width: '30%'
                    }
                ]
            },
            {
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'component',
                        width: '55%',
                        html: [
                            '<img src="http://plachold.it/25x25"><h5> Playlist Title</h5>',
                            '<a hrer="#">http://pbs.com/videos/science/geo4</a>'
                        ].join(''),
                    },
                    {
                        xtype: 'selectfield',
                        width: '15%',
                        options: ['stuff']
                    },
                    {
                        xtype: 'textfield',
                        width: '30%'
                    }
                ]
            },
            {
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'component',
                        width: '55%',
                        html: [
                            '<img src="http://plachold.it/25x25"><h5> Playlist Title</h5>',
                            '<a hrer="#">http://pbs.com/videos/science/geo4</a>'
                        ].join('')
                    },
                    {
                        xtype: 'selectfield',
                        width: '15%',
                        options: ['stuff']
                    },
                    {
                        xtype: 'textfield',
                        width: '30%'
                    }
                ]
            },
            {
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'component',
                        width: '55%',
                        html: [
                            '<img src="http://plachold.it/25x25"><h5> Playlist Title</h5>',
                            '<a hrer="#">http://pbs.com/videos/science/geo4</a>'
                        ].join('')
                    },
                    {
                        xtype: 'selectfield',
                        width: '15%',
                        options: ['stuff']
                    },
                    {
                        xtype: 'textfield',
                        width: '30%'
                    }
                ]
            },
            {
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'component',
                        width: '55%',
                        html: [
                            '<img src="http://plachold.it/25x25"><h5> Playlist Title</h5>',
                            '<a hrer="#">http://pbs.com/videos/science/geo4</a>'
                        ].join('')
                    },
                    {
                        xtype: 'selectfield',
                        width: '15%',
                        options: ['stuff']
                    },
                    {
                        xtype: 'textfield',
                        width: '30%'
                    }
                ]
            },
            {
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'component',
                        width: '55%',
                        html: [
                            '<img src="http://plachold.it/25x25"><h5> Playlist Title</h5>',
                            '<a hrer="#">http://pbs.com/videos/science/geo4</a>'
                        ].join('')
                    },
                    {
                        xtype: 'selectfield',
                        width: '15%',
                        options: ['stuff']
                    },
                    {
                        xtype: 'textfield',
                        width: '30%'
                    }
                ]
            }
        ]
    }
});