Ext.define('SparkClassroom.column.LearnType', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-learntype-column',


    statics: {
        icons: {
            assessment: 'pencil',
            video: 'youtube-play',
            exercise: 'bicycle',
            lesson_plan: 'list-ol',
            article: 'newspaper-o',
            question: 'question-circle',
            game: 'gamepad',
            other: 'file',
            'Practice Problems': 'calculator',
            'IEPFriendly': 'folder-open-o',
            'Reading': 'bookmark-o'
        }
    },

    config: {
        cls: 'spark-learntype-column',
        width: 64,
        text: 'Type',
        cell: {
            encodeHtml: false
        },
        renderer: function(v, r) {
            var icons = this.self.icons,
                learnType = r.get('type'),
                icon = icons[learnType];

            if (icon) {
                return '<div class="text-center" title="' + learnType + '"><i class="fa fa-lg fa-' + icon + '"></i></div>';
            }

            return '<span title="' + learnType + '">' + learnType +  '</span>';
        }
    }
});