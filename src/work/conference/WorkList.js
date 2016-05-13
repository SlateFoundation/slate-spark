Ext.define('SparkClassroom.work.conference.WorkList', {
    extend: 'Ext.Component',
    xtype: 'spark-worklist',
    requires: [ 'Ext.XTemplate' ],


    config: {
        cls: 'spark-worklist-ct',
        tpl: [
            '<tpl if="title"><h2 class="spark-worklist-title">{title:htmlEncode}</h2></tpl>',
            '<ol class="spark-worklist">',
                '<tpl if="values.items.length &gt; 0">',
                    '<tpl for="items">',
                        '<li class="spark-worklist-item <tpl if="assignment">is-required</tpl> <tpl if="values.source == \'student\'">is-student-submitted</tpl>">',
                            '<tpl if="skipHtmlEncode">{text}<tpl else>{text:htmlEncode}</tpl>',
                            '<tpl if="linkUrl">',
                                '&nbsp;&mdash; ',
                                '<a href="{linkUrl}" target=_blank>',
                                    '<tpl if="linkTitle">{linkTitle}<tpl else>{linkUrl}</tpl>',
                                '</a>',
                            '</tpl>',
                            '<tpl if="values.source == \'student\'">',
                                '<i class="fa fa-graduation-cap" title="Student-Submitted"></i>',
                            '</tpl>',
                            '<tpl if="assignment">',
                                '<i class="fa fa-asterisk" title="Required"></i>',
                            '</tpl>',
                        '</li>',
                    '</tpl>',
                '<tpl else>',
                    '<div class="empty-text">None listed.</div>',
                '</tpl>',
            '</ol>'
        ]
    }
});