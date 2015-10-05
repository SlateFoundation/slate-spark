Ext.define('SparkClassroom.work.conference.WorkList', {
    extend: 'Ext.Component',
    xtype: 'spark-worklist',
    requires: [ 'Ext.XTemplate' ],


    config: {
        cls: 'spark-worklist-ct',
        tpl: [
            '<tpl if="title"><h2 class="spark-worklist-title">{title:htmlEncode}</h2></tpl>',
            '<ol class="spark-worklist">',
                '<tpl for="items">',
                    '<li class="spark-worklist-item <tpl if="studentSubmitted">is-student-submitted</tpl>">',
                        '<tpl if="skipHtmlEncode">{text}<tpl else>{text:htmlEncode}</tpl>',
                        '<tpl if="linkUrl">',
                            '&nbsp;&mdash; ',
                            '<a href="{linkUrl}" target=_blank>',
                                '<tpl if="linkTitle">{linkTitle}<tpl else>{linkUrl}</tpl>',
                            '</a>',
                        '</tpl>',
                    '</li>',
                '</tpl>',
            '</ol>'
        ]
    }
});