/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.Waitlist', {
    extend: 'Ext.dataview.List',
    xtype: 'spark-waitlist',
    requires: [
        'Jarvus.util.format.FuzzyTime'
    ],


    config: {
        cls: 'spark-gps-waitlist',

        store: 'HelpRequests',
        itemTpl: [
            '<header class="waitlist-item-header">',
                '<tpl for="student.getData()">',
                    '<a class="waitlist-name" href="{[Slate.API.buildUrl("/people/" + values.Username)]}" target="_blank" onclick="return false;">{FullName}</a> ',
                '</tpl>',
                '<span class="waitlist-timer">{open_time:fuzzyTime(true)}</span> ',
                '<i class="fa fa-times item-remove-btn"></i>',
            '</header>',
            '<div class="waitlist-type">{human_request_type}</div> '
        ]
    },

    onItemTap: function(ev, t) {
        var me = this;

        if (ev.getTarget('.item-remove-btn')) {
            me.fireEvent('deletetap', me, Ext.get(t).component);
            return;
        }

        me.callParent(arguments);
    }
});