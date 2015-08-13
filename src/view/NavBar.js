/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.view.NavBar', {
    extend: 'Ext.Toolbar',
    xtype: 'spark-navbar',
    cls: 'spark-navbar',

    config: {
        layout: {
            pack: 'end'
        },

        items: [
            {
                cls: 'is-selected',
                text: 'Student Work',
                href: '#student-work' // TODO: make hrefs jump down to tabbed section
            },
            {
                text: 'Competency Overview',
                href: '#overview'
            },
            {
                text: 'Assign Sparkpoints',
                href: '#assign-sparkpoints'
            },
            {
                text: 'Activity',
                href: '#activity' // TODO: this will trigger the activity popover
            }
        ]
    }
});