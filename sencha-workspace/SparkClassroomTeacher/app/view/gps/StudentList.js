/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.StudentList', {
    extend: 'Ext.dataview.List',
    xtype: 'spark-gps-studentlist',
    mixins: [
        'SparkClassroom.mixin.DockedTitle'
    ],
    requires: [
        'Jarvus.util.format.FuzzyTime'
    ],


    config: {
        showDismissButton: false,

        loadingText: null,
        cls: 'spark-gps-studentlist',
        itemCls: 'studentlist-item',
        itemTpl: [
            '<header class="studentlist-item-header">',
                '<tpl for="student.getData()">',
                    '<a class="studentlist-name" href="{[Slate.API.buildUrl("/people/" + values.Username)]}" target="_blank" onclick="return false;">{FullName}</a> ',
                '</tpl>',
                '<tpl if="help_request"><span class="studentlist-request">{help_request_abbr}</span></tpl> ',

                '{% values.duration = this.getDuration(values) %}',
                '<tpl if="duration">',
                    '<span class="studentlist-timer">',
                        '{duration:fuzzyDuration(true)}',
                    '</span>',
                '</tpl>',
                '<tpl if="showDismissButton">',
                    '<i class="fa fa-times item-remove-btn"></i>',
                '</tpl>',
            '</header>',
            '<ul class="studentlist-standards">', // TODO: rename to studentlist-sparkpoints
                // '<tpl for="Standards">',
                    '<li class="studentlist-standard">{sparkpoint}</li>',
                // '</tpl>',
            '</ul>',
            {
                getDuration: function(data) {
                    switch (data.active_phase) {
                        case 'learn':
                            return data.learn_subphase_duration;
                        case 'conference':
                            return data.conference_subphase_duration;
                        case 'apply':
                            return data.apply_subphase_duration;
                        case 'assess':
                            return data.assess_subphase_duration;
                        default:
                            return null;
                    }
                }
            }
        ]
    },

    prepareData: function(data, index, record) {
        data.showDismissButton = this.getShowDismissButton();
        return data;
    },

    onItemTap: function(ev, t) {
        var me = this;

        if (ev.getTarget('.item-remove-btn')) {
            me.fireEvent('itemdismisstap', me, Ext.get(t).component);
            return;
        }

        me.callParent(arguments);
    }
});
