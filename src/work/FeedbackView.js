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
            '<h3 class="dated-list-date">',
                'By <a href="{[Slate.API.buildUrl("/people/" + values.author_id)]}" target="_blank">{author_name}</a>',
                ' on <time datetime="{created_time:date("C")}">{created_time:date("l, F d \\\\a\\\\t Y g:i A")}</time>',
            '</h3>',
            '<div class="dated-list-content">{[fm.nl2br(fm.htmlEncode(values.message))]}</div>'
        ],
        emptyText: 'None yet for this phase'
    }
});