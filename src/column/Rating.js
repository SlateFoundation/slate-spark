Ext.define('SparkClassroom.column.Rating', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-rating-column',

    config: {
        dataIndex: 'student_rating',
        cls: 'spark-rating-column',
        width: 112,
        align: 'center',
        text: 'Avg. Rating' + '<small class="flex-ct"><div class="flex-1">S</div><div class="flex-1">T</div></small>',
        tpl: '<div class="flex-ct text-center"><div class="flex-1">{student_rating}</div><div class="flex-1">{teacher_rating}</div></div>',
        cell: {
            encodeHtml: false
        }
    }
});
