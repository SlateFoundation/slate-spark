Ext.define('SparkClassroom.widget.DiscussionList', {
    extend: 'Ext.Component',
    xtype: 'spark-discussion-list',
    cls: 'spark-discussion-list-ct',

    config: {
        tpl: [
            '<ul class="spark-discussion-list">',
                '<tpl for=".">',
                    '<li class="spark-discussion-item">',
                        '<address class="spark-discussion-author"><a href="{authorUrl}">{authorName}</a></address>',
                        '<div class="spark-discussion-text">{text}</div>',
                        '<time class="spark-discussion-timestamp">{timestamp}</time>',
                    '</li>',
                '</tpl>',
            '</ul>'
        ]
    }
});