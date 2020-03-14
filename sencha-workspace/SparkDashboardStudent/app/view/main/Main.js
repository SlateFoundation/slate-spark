/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting causes an instance of this class to be created and
 * added to the Viewport container.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('SparkDashboardStudent.view.main.Main', {
    extend: 'Ext.Container',
    xtype: 'app-main',

    requires: [],

    items: [
        {
            xtype: 'container',
            layout: 'hbox',
            defaults: {
                xtype: 'component'
            },
            items: [
                {
                    html: 'student photo'
                },
                {
                    flex: 1,
                    html: 'student name<br>grade • advisor</br>'
                },
                {
                    html: 'class/teacher info'
                },
                {
                    html: 'header image control'
                }
            ]
        },
        {
            xtype: 'container',
            layout: 'hbox',
            defaults: {
                flex: 1
            },
            items: [
                {
                    html: 'classes'
                },
                {
                    html: 'behavior'
                },
                {
                    html: 'attendance'
                }
            ]
        },
        {
            html: 'class cards'
        }
    ]
});
