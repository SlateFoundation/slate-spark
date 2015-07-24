/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.apply.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-apply',
    requires: [
        'SparkClassroomStudent.view.apply.SuggestionTable'
    ],

    config: {
        title: 'Apply',
        layout: 'vbox',
        items: [
            {
                xtype: 'container',
                items: [
                    {
                        xtype: 'component',
                        html: 'Time to Apply your Knowledge!'
                    },
                    {
                        xtype: 'spark-apply-suggestiontable'
                    }
                ]
            },
            {
                xtype: 'button',
                text: 'Choose a Selected Apply'
            }
        ]
    }
});