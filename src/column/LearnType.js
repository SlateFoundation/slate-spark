Ext.define('SparkClassroom.column.LearnType', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-learntype-column',

    config: {
        cls: 'spark-learntype-column',
        width: 64,
        text: 'Type',
        cell: {
            encodeHtml: false
        },
        renderer: function(v, r) {
            var type = r.get('type');

            // TODO get list of possible strings and assign icons
            var icons = {
                'Video':                'youtube-play',
                'Article':              'newspaper-o',
                'Practice Problems':    'calculator',
                'IEPFriendly':          'folder-open-o',
                'Reading':              'bookmark-o'
            };

            var icon = icons[type];

            if (icon) {
                return '<div class="text-center" title="' + type + '"><i class="fa fa-lg fa-' + icon + '"></i></div>';
            } else {
                return type;
            }
        }
    }
});
