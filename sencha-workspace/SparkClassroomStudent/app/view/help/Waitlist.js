/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.help.Waitlist', {
    extend: 'Ext.dataview.List',
    xtype: 'spark-waitlist',
    requires: [
        'Jarvus.util.format.FuzzyTime'
    ],


    config: {
        store: 'HelpRequests',
        itemTpl: [
            '<span class="spark-waitlist-name">{student_name}</span> ',
            '<span class="spark-waitlist-time">{open_time:fuzzyTime(true)}</span> ',
            '<span class="spark-waitlist-x">{short_request_type}</span> ',
            '<tpl if="can_close">',
                '<i class="fa fa-times-circle item-delete-btn"></i>',
            '</tpl>'
        ]
    },

    onItemTap: function(ev, t) {
        var me = this;

        if (ev.getTarget('.item-delete-btn')) {
            me.fireEvent('deletetap', me, Ext.get(t).component);
            return;
        }

        me.callParent(arguments);
    }
});