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
            '<header class="item-header">',
                '<tpl for="student.getData()">',
                    '<a class="item-origin" href="{[Slate.API.buildUrl("/people/" + values.Username)]}" target="_blank" onclick="return false;">{FullName}</a> ',
                '</tpl>',

                // TODO for future use, re-enable this with correct field
                // '<tpl if="help_request">',
                //     '<span class="item-flag">{help_request_abbr}</span>',
                // '</tpl> ',

                '{% values.duration = this.getDuration(values) %}',
                '<tpl if="duration">',
                    '<span class="item-timestamp">',
                        '{duration:fuzzyDuration(true)}',
                    '</span>',
                '</tpl>',
                '<tpl if="showDismissButton">',
                    '<i class="fa fa-times item-remove-btn"></i>',
                '</tpl>',
            '</header>',
            '<div class="item-description">',
                '<ul class="gps-list-sparkpoints">',
                    '<li class="gps-list-sparkpoint">{sparkpoint}</li>',
                '</ul>',
            '</div>',
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
