/**
 * This class is the header of the learn page of the course tracker.
 */
Ext.define('MatchbookStudent.view.tracker.learn.Header', {
    extend: 'Ext.container.Container',
    xtype: 'tracker-learn-header',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'container',
        data: {course: 'CCSS.Math.Content.1.0A.A.1'},
        tpl: '<h1>{course}</h1>'
    },{
        // spacer
        xtype: 'component',
        flex: 1
    },{
        xtype: 'container',
        data: {
            completed: 2,
            total: 5
        },
        tpl: 'You\'ve completed {completed}/{total} of the required learned'
    }]

});
