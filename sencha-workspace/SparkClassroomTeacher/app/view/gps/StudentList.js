/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.StudentList', {
    extend: 'Ext.dataview.List',
    xtype: 'spark-gps-studentlist',
    requires: [
        'Jarvus.util.format.FuzzyTime'
    ],


    config: {
        title: null,
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
                            if (!data.learn_start_time) {
                                return null;
                            }

                            return Date.now() - data.learn_start_time;
                        default:
                            return null;
                    }
                }
            }
        ]
    },

    applyTitle: function(title, existingTitle) {
        if (Ext.isString(title)) {
            title = {
                title: title
            };
        }

        return Ext.factory(title, 'Ext.Title', existingTitle);
    },

    updateTitle: function(title, oldTitle) {
        if (title) {
            title.setDocked('top');
            this.add(title);
        }

        if (oldTitle) {
            this.remove(oldTitle);
        }
    },

    doRefresh: function() {
        var me = this,
            countStr = me.getStore().getCount().toString(),
            titleCmp = me.getTitle(),
            countEl = me.countEl;

        me.callParent(arguments);

        if (countEl) {
            countEl.setHtml(countStr);
        } else {
            me.countEl = titleCmp.getInnerHtmlElement().appendChild({
                tag: 'span',
                cls: 'count',
                html: countStr
            });
        }
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
