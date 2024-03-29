Ext.define('SparkClassroom.column.LearnType', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-learntype-column',


    statics: {
        icons: {
            assessment: 'check-circle-o',
            video: 'youtube-play',
            exercise: 'bicycle',
            lesson_plan: 'list-ol',
            article: 'newspaper-o',
            question: 'question-circle',
            game: 'gamepad',
            homework: 'home',
            other: 'file',
            'Practice Problems': 'calculator',
            'IEPFriendly': 'folder-open-o',
            'Reading': 'bookmark-o'
        }
    },

    config: {
        dataIndex: 'type',
        cls: 'spark-learntype-column',
        width: 64,
        text: 'Type',
        cell: {
            encodeHtml: false,
            cls: 'spark-tooltip-cell'
        },
        renderer: function(learnType, r) {
            if (!learnType) {
                return '';
            }

            var icons = this.self.icons,
                icon = icons[learnType];

            if (icon) {
                return '<div class="text-center spark-tooltip-cell">'
                    + '<div class="spark-tooltip-cell-text">' + learnType + '</div> '
                    + '<i class="fa fa-lg fa-' + icon + '"></i>'
                + '</div>';
            }

            return '<span title="' + learnType + '">' + learnType +  '</span>';
        }
    }
});