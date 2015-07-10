/**
 * This class is the Conference page of the course tracker.
 */
Ext.define('MatchbookStudent.view.tracker.conference.Main', {
    extend: 'Ext.container.Container',
    xtype: 'tracker-conference-main',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'container',
        data: {
            questions: [{
                question: 'Example of a first guiding question that a student should be prepared to respond to.'
            },{
                question: 'Example of a second guiding question that a student should be prepared to respond to.'
            },{
                question: 'Example of a third guiding question that a student should be prepared to respond to.'
            }],
            resources: [{
                resource: {
                    title: 'Title of resource',
                    url: 'http://www.google.com'
                }
            },{
                resource: {
                    title: 'Title of resource',
                    url: 'http://www.google.com'
                }
            }]
        },
        tpl: [
            '<h1>Prepare for Teacher Conference</h1>',
            '<h2>Guiding Questions:</h2>',
            '<ul style="list-style:none">',
            '<tpl for="questions">',
                '<li>{#}. {question}</li>',
            '</tpl>',
            '<li>{questions.length+1}. <input type="text" size="40"><button type="button">Add</button></li>',
            '</ul>',
            '<h2>Resources:</h2>',
            '<ul style="list-style:none">',
            '<tpl for="resources">',
                '<li>{#}. {resource.title} - {resource.url}</li>',
            '</tpl>',
            '</ul>'
        ]
    },{
        xtype: 'form',
        items: [{
            xtype : 'textareafield',
            grow : true,
            fieldLabel: 'Restate the Learn target in your own words',
            labelAlign: 'top',
            name: 'first',
            allowBlank: false
        },{
            xtype : 'textareafield',
            grow : true,
            fieldLabel: 'Describe the step used to show understanding of the skill',
            labelAlign: 'top',
            name: 'second',
            allowBlank: false
        },{
            xtype: 'box',
            autoEl: {tag: 'hr'}
        },{
            xtype: 'box',
            html: [
                '<div style="width: 100%;overflow: hidden;">',
                    '<h1 style="float:left">Peer Conference:</h1>',
                    '<div style="margin-top:18px;margin-left:240px">(optional)</div>',
                '</div>'
            ]
        },{
            xtype : 'combo',
            fieldLabel: 'Peer\'s Name',
            labelAlign: 'top',
            name: 'peer',
            allowBlank: false
        },{
            xtype : 'textareafield',
            grow : true,
            fieldLabel: 'Feedback from Peer',
            labelAlign: 'top',
            name: 'second',
            allowBlank: false
        },{
            xtype: 'button',
            text: 'Request a Teacher Conference'
        },{
            xtype : 'textareafield',
            grow : true,
            fieldLabel: 'Feedback from Teacher',
            labelAlign: 'top',
            name: 'second',
            allowBlank: false
        }]
    }]

});
