/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.assign.points.apply.Form', {
    extend: 'Ext.form.Panel',
    xtype: 'spark-assign-points-apply-form',

    config: {
        items: [
            {
                xtype: 'component',
                html: '<h4>Project Title</h4>'  
            },
            {
                xtype: 'textareafield',
                labelAlign: 'top',
                label: 'Instructions'
            },
            {
                xtype: 'fieldset',
                layout: 'hbox',
                label: 'Time Estimate',
                labelAlign: 'top',
                items: [
                    {
                        xtype: 'textfield',
                        placeHolder: '1 Hour',
                        flex: 1
                    },
                    {
                        xtype: 'textfield',
                        placeHolder: '30 Minutes',
                        flex: 1
                    }
                ]
            },
            {
                xtype: 'fieldset',
                label: 'ToDOs',
                items: [
                    {
                        xtype: 'textfield',
                        placeHolder: 'TODO 1'
                    },
                    {
                        xtype: 'textfield',
                        placeHolder: 'TODO 2'
                    },
                    {
                        xtype: 'textfield',
                        placeHolder: 'TODO 3'
                    }
                ]
            },
            {
                xtype: 'fieldset',
                label: 'Links',
                items: [
                    {
                        xtype: 'textfield',
                        placeHolder: 'http://stuff.com'
                    },
                    {
                        xtype: 'textfield',
                        placeHolder: 'http://youtube.com'
                    }
                ]
            }
        ]
    }
});