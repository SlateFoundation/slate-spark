Ext.define('SparkClassroom.column.StudentRating', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-column-studentrating',
	cls: 'spark-column-studentrating',

    config: {
        enableEditing: false,

        dataIndex: 'rating',
        width: 112,
        text: 'Your Rating',
        cell: {
	        cls: 'spark-cell-studentrating',
            encodeHtml: false
        },
        renderer: function(v, r) {
            return [
            	'<button type="button" class="plain spark-studentrating-like">',
            		'<i class="fa fa-thumbs-up"></i>',
            		'<span class="visually-hidden">Like</span>',
            	'</button>',

            	'<button type="button" class="plain spark-studentrating-dislike">',
            		'<i class="fa fa-thumbs-down"></i>',
            		'<span class="visually-hidden">Dislike</span>',
            	'</button>',
            ].join(' ');
        }
    }
});