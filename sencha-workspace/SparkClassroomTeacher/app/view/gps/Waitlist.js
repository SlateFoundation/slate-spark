/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.Waitlist', {
    extend: 'Ext.dataview.List',
    xtype: 'spark-waitlist',
    mixins: [
        'SparkClassroom.mixin.DockedTitle'
    ],
    requires: [
        'Jarvus.util.format.FuzzyTime'
    ],


    config: {
        cls: 'spark-gps-waitlist',

        store: 'HelpRequests',
        itemTpl: [
            '<header class="item-header">',
                '<tpl for="student.getData()">',
                    '<a class="item-origin" href="{[Slate.API.buildUrl("/people/" + values.Username)]}" target="_blank" onclick="return false;">{FullName}</a> ',
                '</tpl>',
                '<span class="item-timestamp">{open_time:fuzzyTime(true)}</span> ',
                '<i class="fa fa-times item-remove-btn"></i>',
            '</header>',
            '<div class="item-description">',
                '<tpl switch="request_type">',
                    '<tpl case="question-academic">',
                        '<i class="item-icon fa fa-fw fa-graduation-cap"></i>',
                    '<tpl case="question-technology">',
                        '<i class="item-icon fa fa-fw fa-gears"></i>',
                    '<tpl case="nurse">',
                        '<i class="item-icon fa fa-fw fa-medkit"></i>',
                    '<tpl case="bathroom">',
                        '<i class="item-icon fa fa-fw fa-tint"></i>',
                    '<tpl case="locker">',
                        '<i class="item-icon fa fa-fw fa-book"></i>',
                    '<tpl default>',
                        '<i class="item-icon fa fa-fw fa-question-circle"></i>',
                '</tpl> ',
                '<span class="waitlist-type">{human_request_type}</span>',
            '</div>'
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