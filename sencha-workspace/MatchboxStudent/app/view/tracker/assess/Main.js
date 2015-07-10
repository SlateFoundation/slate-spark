/**
 * This class is the Apply page of the course tracker.
 */
Ext.define('MatchbookStudent.view.tracker.assess.Main', {
    extend: 'Ext.container.Container',
    xtype: 'tracker-assess-main',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'container',
        data: {
            assessments: [{
                assessment: {
                    Completed: false,
                    Title: 'Title',
                    Score: ''
                }
            },{
                assessment: {
                    Completed: true,
                    Title: 'Title',
                    Score: '18/20'
                }
            },{
                assessment: {
                    Completed: true,
                    Title: 'Title',
                    Score: ''
                }
            }]
        },
        tpl: [
            '<h1>Select an assessment</h1>',
            '<table>',
            '<tr>',
            '<th>Assessment</th>',
            '<th>Completed</th>',
            '<th>Score</th>',
            '<th>Issues</th>',
            '</tr>',
            '<tpl for="assessments">',
                '<tr>',
                '<td>{assessment.Title}</td>',
                '<td>{assessment.Completed}</td>',
                '<td>{assessment.Score}</td>',
                '<td>X</td>',
                '</td>',
                '</tr>',
            '</tpl>',
            '</table>'
        ]
    },{
        xtype: 'box',
        html: '<h2>Reflection</h2>'
    },{
        xtype : 'textareafield',
        grow : true,
        fieldLabel: 'How does this standard apply to everyday life',
        labelAlign: 'top',
        name: 'second',
        allowBlank: false
    },{
        xtype: 'tracker-assess-learngrid'
    },{
        xtype: 'button',
        text: 'Submit for Grading'
    }]

});
