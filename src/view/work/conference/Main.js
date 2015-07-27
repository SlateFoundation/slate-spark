
Ext.define('SparkClassroom.view.work.conference.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work-conference',
    requires: [
        'Jarvus.touch.layout.Accordion',
        'SparkClassroom.view.work.conference.peer.Form',
        'SparkClassroom.view.work.conference.peer.Component'
    ],

    config: {
        items: [
            {
                layout: 'hbox',
                items: [
                    {
                        xtype: 'container',
                        flex: 1,
                        items: [
                            {
                                xtype: 'container',
                                layout: 'accordion',
                                items: [
                                    {
                                        xtype: 'component',
                                        title: 'Standard 2 - CCSS.ELA.3.CC.4.A',
                                        html: [
                                            '<h5>Guiding Questions</h5>',
                                            '<ol>',
                                                '<li>Example of a first guiding question that a student should me prepared to respond to.</li>',
                                                '<li>Example of a second guiding question that a student should me prepared to respond to.</li>',
                                                '<li>Example of a third guiding question that a student should me prepared to respond to.</li>',
                                                //FIXME: Replace with custod add with textfield
                                                '<li><input type="text"><span class="button">Add</span></li>',
                                            '</ol>',
                                            '<hr>',
                                            '<h5>Resources</h5>',
                                            '<ol>',
                                                '<li>Title of Resource - <a href="#">documenttoshare.pdf</a></li>',
                                                '<li>Title of Resource - <a href="#">http://webpage.com</a></li>',
                                            '</ol>'
                                        ].join('')
                                    },
                                    {
                                        xtype: 'component',
                                        html: 'stuff',
                                        title: 'Standard 2 - CCSS.ELA.3.CC.4.A'
                                    },
                                    {
                                        xtype: 'component',
                                        html: 'stuff',
                                        title: 'Standard 3 - CCSS.ELA.3.CC.4.A'
                                    }
                                ]
                            },
                            {
                                xtype: 'spark-work-conference-peer-form',
                                userClass: 'Student'
                            },
                            {
                                xtype: 'spark-work-conference-peer-component',
                                userClass: 'Teacher'
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        width: '30%',
                        layout: 'vbox',
                        userClass: 'Teacher',
                        items: [
                            {
                                xtype: 'container',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'component',
                                        html: 'timer'
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'Pause Conference'
                                    }
                                ]
                            },
                            {
                                xtype: 'formpanel',
                                flex: 1,
                                items: [
                                    {
                                        xtype: 'textfield',
                                        placeHolder: 'Subject'
                                    },
                                    {
                                        xtype: 'textareafield',
                                        placeHolder: 'Message'
                                    },
                                    {
                                        xtype: 'fieldset',
                                        label: 'To',
                                        items: [
                                            {
                                                xtype: 'radiofield',
                                                label: 'Alexandra W'
                                            },
                                            {
                                                xtype: 'radiofield',
                                                label: 'Current Standard'
                                            },
                                            {
                                                xtype: 'radiofield',
                                                label: 'All in group'
                                            },
                                            {
                                                xtype: 'radiofield',
                                                label: 'All in Conference'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'Log'
                                    }
                                ]
                            },
                            {
                                xtype: 'component',
                                html: 'mastery score'
                            }
                        ]
                    }
                ]
            }
        ]
    }
});