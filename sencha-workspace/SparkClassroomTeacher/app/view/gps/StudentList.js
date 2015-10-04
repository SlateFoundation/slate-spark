/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.StudentList', {
    extend: 'Ext.dataview.List',
    xtype: 'spark-gps-studentlist',
    requires: [
        'Jarvus.util.format.FuzzyTime'
    ],


    config: {
        title: null,

        loadingText: null,
        cls: 'spark-gps-studentlist',
        itemCls: 'studentlist-item',
        itemTpl: [
            '<header class="studentlist-item-header">',
                '<tpl for="student.getData()">',
                    '<a class="studentlist-name" href="{[Slate.API.buildUrl("/people/" + values.Username)]}" target="_blank">{FullName}</a> ',
                '</tpl>',
                '<tpl if="Grade"><span class="studentlist-grade">{Grade}</span></tpl> ', // TODO: what should go here?
                '<span class="studentlist-timer">',
                    '{[Ext.util.Format.fuzzyDuration(values[values.phase+"_duration"] * 1000, true)]}',
                '</span>',
            '</header>',
            '<ul class="studentlist-standards">', // TODO: rename to studentlist-sparkpoints
                // '<tpl for="Standards">',
                    '<li class="studentlist-standard">{sparkpoint_code}</li>',
                // '</tpl>',
            '</ul>'
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
    }
});
