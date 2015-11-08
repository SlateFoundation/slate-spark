/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.FeedbackView', {
    extend: 'Ext.dataview.DataView',
    xtype: 'spark-feedbackview',


    config: {
        baseCls: 'spark-panel',
        scrollable: false,
        margin: '32 0 0 0',

        items: {
            docked: 'top',

            xtype: 'title',
            baseCls: 'spark-panel-title',
            title: 'Feedback from Teacher'
        },

        itemCls: 'dated-list-item',
        itemTpl: [
            '<h3 class="dated-list-date">{created_time:date} by {author_name}</h3>',
            '<div class="dated-list-content">{message}</div>'
        ],
        emptyText: 'None yet for this phase'
    }
});