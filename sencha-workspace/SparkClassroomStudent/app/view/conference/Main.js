/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.conference.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-conference',

    config: {
        title: 'Learn &amp; Practice',
        layout: 'vbox',
        items: [
            {
                xtype: 'container',
                items: [
                    {
                        xtype: 'component',
                        html: 'You\'ve completed 3 outof 5 required learns'
                    },
                    {
                        xtype: 'component',
                        html: [
                            '<h6>Guiding Questions:</h6>',
                            '<ol>',
                                '<li>Example of first guiding questing that a student should be prepared to respond to</li>',
                                '<li>Example of second guiding questing that a student should be prepared to respond to</li>',
                                '<li>Example of third guiding questing that a student should be prepared to respond to</li>',
                                '<li>Example of fourh guiding questing that a student should be prepared to respond to</li>',
                            '</ol>',
                            '<h6>Resources:</h6>',
                            '<ol>',
                                '<li>Title of resource - <a href="http://test.com">test.pdf</a></li>',
                                '<li>Title of resource - <a href="http://test.com">testing.com</a></li>',
                            '</ol>'
                        ].join('')
                    }
                ]
            },
            {
                xtype: 'component',
                html: 'Standard 2'
            },
            {
                xtype: 'formpanel',
                defaults: {
                    labelAlign: 'top'
                },
                items: [
                    {
                        xtype: 'textareafield',
                        label: 'Restate the Learn target in your own words',
                        placeHolder: 'Active text field wit green line below. LorLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
                    },
                    {
                        xtype: 'textareafield',
                        label: 'Describe the steps used to show understanding of the skill'
                    },
                    {
                        xtype: 'fieldset',
                        label: 'Cite 3 real world examples of learning target:',
                        layout: 'vbox',
                        items: [
                            {
                                xtype: 'textfield',
                                label: '1.'
                            },
                            {
                                xtype: 'textfield',
                                label: '2.'
                            },
                            {
                                xtype: 'textfield',
                                label: '3.'
                            }
                        ]
                    },
                    {
                        xtype: 'component',
                        html: 'Peer Conference: (optional)'
                    },
                    {
                        xtype: 'selectfield',
                        label: 'Peer\'s Name',
                        options: ['Stuff']
                    }, {
                        xtype: 'textareafield',
                        label: 'Feedback from Peer'
                    }
                ]
            },
            {
                xtype: 'button',
                text: 'Request a Teacher Conference'
            },
            {
                xtype: 'component',
                html: [
                    '<h6>Feedback from Teacher</h6>',
                    '<span>4/10/15 <br Any info a teacher wants></span>'
                ].join('')
            }
        ]
    }
});