Ext.define('SparkClassroom.column.Rating', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-rating-column',

    config: {
        cls: 'spark-rating-column',
        width: 112,
        align: 'center',
        text: 'Avg. Rating' + '<small class="flex-ct"><div class="flex-1">S</div><div class="flex-1">T</div></small>',
        renderer: function(v, r) {
            return '<div class="flex-ct text-center"><div class="flex-1">' + r.get('srating') + '</div><div class="flex-1">' + r.get('trating') + '</div></div>';
        },
        cell: {
            encodeHtml: false
        }
    }
});
