/* global SparkClassroom */
Ext.define('SparkClassroomTeacher.view.gps.StudentList', {
    extend: 'Ext.dataview.List',
    xtype: 'spark-gps-studentlist',
    mixins: [
        'SparkClassroom.mixin.DockedTitle'
    ],
    requires: [
        'SparkClassroom.timing.DurationDisplay',
        'Jarvus.util.format.FuzzyTime'
    ],


    config: {
        showDismissButton: false,

        loadingText: null,
        cls: 'spark-gps-studentlist',
        itemCls: 'studentlist-item',
        itemHeight: 60,
        itemTpl: [
            '<header class="item-header">',
                '<tpl for="student.getData()">',
                    '<a class="item-origin" href="{[Slate.API.buildUrl("/people/" + values.Username)]}" target="_blank" onclick="return false;">{FullName}</a> ',
                '</tpl>',

                // TODO for future use, re-enable this with correct field
                // '<tpl if="help_request">',
                //     '<span class="item-flag">{help_request_abbr}</span>',
                // '</tpl> ',

                '<tpl if="subphase_duration">',
                    '<span class="item-timestamp">',
                        '{[ this.adjustDuration(values) ]}',
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
            adjustDuration: function(r) {
                return SparkClassroom.timing.DurationDisplay.calculateDuration(r.section_code, r.subphase_start_time);
            }
        }]
    },

    prepareData: function(data) {
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
