/**
 * This class is the Apply page of the course tracker.
 */
Ext.define('MatchbookStudent.view.tracker.apply.Main', {
    extend: 'Ext.container.Container',
    xtype: 'tracker-apply-main',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'container',
        data: {
            applies: [{
                apply: {
                    selected: false,
                    Title: 'Title',
                    Description: 'Write a paragraph that has both active and passive voice sentences. Be sure to underline your sentences that display the learning target.',
                    Standards: [{
                        Code: '8.L.01b'
                    },{
                        Code: '8.L.7'
                    },{
                        Code: '8.L.5'
                    }]
                }
            },{
                apply: {
                    selected: true,
                    Title: 'Title',
                    Description: 'Write a paragraph that has both active and passive voice sentences. Be sure to underline your sentences that display the learning target.',
                    Standards: [{
                        Code: '8.L.01b'
                    },{
                        Code: '8.L.7'
                    },{
                        Code: '8.L.5'
                    }]
                }
            },{
                apply: {
                    selected: true,
                    Title: 'Title',
                    Description: 'Write a paragraph that has both active and passive voice sentences. Be sure to underline your sentences that display the learning target.',
                    Standards: [{
                        Code: '8.L.01b'
                    },{
                        Code: '8.L.7'
                    },{
                        Code: '8.L.5'
                    }]
                }
            }]
        },
        tpl: [
            '<h1>Time to Apply your knowledge!</h1>',
            '<h2>Suggested Applies</h2>',
            '<table>',
            '<tr>',
            '<th colspan="2">Suggested Applies</th>',
            '<th>Standards Incorporated</th>',
            '</tr>',
            '<tpl for="applies">',
                '<tr>',
                '<td>{apply.selected}</td>',
                '<td><p>{apply.Title}</p><p>{apply.Description}</p></td>',
                '<td>',
                    '<tpl for="apply.Standards">',
                        '<span>{Code}</span>',
                    '</tpl>',
                '</td>',
                '</tr>',
            '</tpl>',
            '</table>'
        ]
    },{
        xtype: 'button',
        text: 'Choose a Selected Apply'
    }]

});
