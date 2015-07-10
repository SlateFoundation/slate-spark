/**
 * This class is the question form in the popup window for the help button of the course tracker.
 */
Ext.define('MatchbookStudent.view.help.WaitList', {
    extend: 'Ext.container.Container',
    xtype: 'help-waitlist',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'radiogroup',
        // Arrange radio buttons into two columns, distributed vertically
        flex: 1,
        columns: 1,
        vertical: true,
        items: [
            { boxLabel: 'Item 1', name: 'rb', inputValue: '1' },
            { boxLabel: 'Item 2', name: 'rb', inputValue: '2', checked: true},
            { boxLabel: 'Item 3', name: 'rb', inputValue: '3' },
            { boxLabel: 'Item 4', name: 'rb', inputValue: '4' },
            { boxLabel: 'Item 5', name: 'rb', inputValue: '5' },
            { boxLabel: 'Item 6', name: 'rb', inputValue: '6' }
        ]
    }]
});
